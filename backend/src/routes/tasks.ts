import { Hono } from "hono";
import { getDb } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { fraudSubmitMiddleware } from "../middleware/fraud";
import { contributorDecayMiddleware, evaluateContributorLevel, LEVEL_RANK } from "../middleware/contributor";
import type { ContributorLevel } from "../middleware/contributor";
import type { AuthPayload } from "../lib/jwt";
import { requireVerified } from "../middleware/verified";

const tasks = new Hono();
tasks.use("*", authMiddleware);
tasks.use("*", contributorDecayMiddleware); // apply inactivity decay on every request

// ─────────────────────────────────────────────────────────────────
// GET /tasks
// Returns the task feed filtered by tier and contributor level.
//
// Query params:
//   ?tier=standard|premium|all  (default: all)
//
// Standard tasks are visible to all verified users.
// Premium tasks are returned but include a `locked` flag + reason
// if the user's level is below the task's min_contributor_level.
// This lets the frontend show premium tasks as "locked" so users
// can see what they are working toward.
// ─────────────────────────────────────────────────────────────────
tasks.get("/", requireVerified, (c) => {
  const db = getDb();
  const user = c.get("user") as AuthPayload;
  const tierFilter = c.req.query("tier"); // 'standard' | 'premium' | undefined (all)

  // Fetch the user's current contributor level
  const userRow = db.query(
    "SELECT contributor_level FROM users WHERE id = ?"
  ).get(user.userId) as { contributor_level: ContributorLevel } | null;

  const userLevel: ContributorLevel = userRow?.contributor_level ?? "new";
  const userRank = LEVEL_RANK[userLevel];

  // Build feed query
  let query = "SELECT * FROM tasks WHERE status = 'active'";
  const params: string[] = [];

  if (tierFilter === "standard" || tierFilter === "premium") {
    query += " AND tier = ?";
    params.push(tierFilter);
  }

  query += " ORDER BY tier DESC, payout_cad DESC, created_at DESC";
  // tier DESC puts 'standard' before 'premium' alphabetically — flip to put premium first:
  // SQLite: 'standard' < 'premium' alphabetically is false; 'premium' < 'standard' so DESC gives premium first. ✓

  const rows = db.query(query).all(...params) as any[];

  // Annotate each task with access metadata
  const annotated = rows.map((task) => {
    const requiredLevel = task.min_contributor_level as ContributorLevel | null;
    const requiredRank = requiredLevel ? LEVEL_RANK[requiredLevel] : 0;
    const locked = requiredRank > userRank;

    return {
      ...task,
      locked,
      locked_reason: locked
        ? requiredLevel === "reliable"
          ? "Requires Reliable contributor status."
          : "Requires Verified Contributor status."
        : null,
      user_contributor_level: userLevel,
    };
  });

  return c.json({ tasks: annotated, contributor_level: userLevel });
});

// ─────────────────────────────────────────────────────────────────
// GET /tasks/:id
// Public detail — includes lock state for the requesting user.
// ─────────────────────────────────────────────────────────────────
tasks.get("/:id", (c) => {
  const db = getDb();
  const user = c.get("user") as AuthPayload;

  const task = db.query(
    "SELECT * FROM tasks WHERE id = ? AND status = 'active'"
  ).get(c.req.param("id")) as any;

  if (!task) return c.json({ error: "Task not found" }, 404);

  const userRow = db.query(
    "SELECT contributor_level FROM users WHERE id = ?"
  ).get(user.userId) as { contributor_level: ContributorLevel } | null;

  const userLevel: ContributorLevel = userRow?.contributor_level ?? "new";
  const requiredLevel = task.min_contributor_level as ContributorLevel | null;
  const locked = requiredLevel ? LEVEL_RANK[requiredLevel] > LEVEL_RANK[userLevel] : false;

  return c.json({
    task: {
      ...task,
      locked,
      locked_reason: locked
        ? requiredLevel === "reliable"
          ? "Requires Reliable contributor status."
          : "Requires Verified Contributor status."
        : null,
    },
    contributor_level: userLevel,
  });
});

// ─────────────────────────────────────────────────────────────────
// POST /tasks/:id/submit
// Blocks submission if the task's tier is premium and the user's
// level is below min_contributor_level. On approval (handled by
// admin route), evaluateContributorLevel() advances the user's level.
// ─────────────────────────────────────────────────────────────────
tasks.post("/:id/submit", fraudSubmitMiddleware, async (c) => {
  const user = c.get("user") as AuthPayload;
  const taskId = c.req.param("id");

  let proof_data = "";
  try {
    const body = await c.req.json();
    proof_data = body?.proof_data || "";
  } catch { /* allow empty body */ }

  const db = getDb();

  const task = db.query(
    "SELECT * FROM tasks WHERE id = ? AND status = 'active'"
  ).get(taskId) as any;

  if (!task) return c.json({ error: "Task not found or inactive" }, 404);

  // ── Contributor level gate for premium tasks
  if (task.min_contributor_level) {
    const userRow = db.query(
      "SELECT contributor_level FROM users WHERE id = ?"
    ).get(user.userId) as { contributor_level: ContributorLevel } | null;

    const userLevel = userRow?.contributor_level ?? "new";
    const requiredRank = LEVEL_RANK[task.min_contributor_level as ContributorLevel];

    if (LEVEL_RANK[userLevel] < requiredRank) {
      return c.json(
        {
          error: "Contributor level too low",
          required_level: task.min_contributor_level,
          current_level: userLevel,
          message:
            task.min_contributor_level === "reliable"
              ? "This task requires Reliable contributor status."
              : "This task requires Verified Contributor status.",
        },
        403
      );
    }
  }

  if (task.max_completions > 0 && task.current_completions >= task.max_completions) {
    return c.json({ error: "This task has reached its maximum completions" }, 400);
  }

  const existing = db.query(
    "SELECT id FROM task_completions WHERE task_id = ? AND user_id = ?"
  ).get(taskId, user.userId);
  if (existing) return c.json({ error: "You've already submitted this task" }, 409);

  db.run(
    "INSERT INTO task_completions (task_id, user_id, proof_data, status) VALUES (?, ?, ?, 'pending_review')",
    [taskId, user.userId, proof_data]
  );

  db.run("UPDATE tasks SET current_completions = current_completions + 1 WHERE id = ?", [taskId]);

  const completion = db.query(
    "SELECT * FROM task_completions WHERE task_id = ? AND user_id = ? ORDER BY id DESC LIMIT 1"
  ).get(taskId, user.userId);

  return c.json({ completion });
});

// ─────────────────────────────────────────────────────────────────
// GET /tasks/status
// Returns the requesting user's contributor level, reliability score,
// progress toward the next level, and inactivity decay information.
// ─────────────────────────────────────────────────────────────────
tasks.get("/status", requireVerified, (c) => {
  const db = getDb();
  const user = c.get("user") as AuthPayload;

  const userRow = db.query(
    "SELECT contributor_level, reliability_score, last_approved_at, status_decays_at FROM users WHERE id = ?"
  ).get(user.userId) as {
    contributor_level: ContributorLevel;
    reliability_score: number;
    last_approved_at: string | null;
    status_decays_at: string | null;
  } | null;

  if (!userRow) return c.json({ error: "User not found" }, 404);

  const approvedCount = (db.query(
    "SELECT COUNT(*) as cnt FROM task_completions WHERE user_id = ? AND status = 'approved'"
  ).get(user.userId) as { cnt: number }).cnt;

  // Determine progress toward next level
  const level = userRow.contributor_level;
  const score = userRow.reliability_score;

  // Use reinstatement threshold if the user has previously passed first-time bar
  const firstTimeReliable = 5;
  const firstTimeVerified = 15;
  const reinstateReliable = 2;
  const reinstateVerified = 5;

  let next_level: ContributorLevel | null = null;
  let tasks_until_next: number | null = null;
  let progress_message: string | null = null;

  if (level === "new") {
    next_level = "reliable";
    const threshold = score > firstTimeReliable ? reinstateReliable : firstTimeReliable;
    tasks_until_next = Math.max(0, threshold - approvedCount);
    progress_message =
      tasks_until_next === 0
        ? "Your next approved task will advance you to Reliable."
        : `${tasks_until_next} more approved task${tasks_until_next === 1 ? "" : "s"} to reach Reliable contributor status.`;
  } else if (level === "reliable") {
    next_level = "verified_contributor";
    const threshold = score > firstTimeVerified ? reinstateVerified : firstTimeVerified;
    tasks_until_next = Math.max(0, threshold - approvedCount);
    progress_message =
      tasks_until_next === 0
        ? "Your next approved task will advance you to Verified Contributor."
        : `${tasks_until_next} more approved task${tasks_until_next === 1 ? "" : "s"} to unlock premium sponsored tasks.`;
  }

  const decaysAt = userRow.status_decays_at ? new Date(userRow.status_decays_at) : null;
  const inactivity_warning =
    decaysAt && decaysAt < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      ? `Your ${level === "verified_contributor" ? "Verified Contributor" : "Reliable"} status will reduce due to inactivity on ${decaysAt.toLocaleDateString("en-CA")}. Complete a task to keep your level.`
      : null;

  return c.json({
    contributor_level: level,
    reliability_score: score,
    approved_completions: approvedCount,
    next_level,
    tasks_until_next,
    progress_message,
    last_approved_at: userRow.last_approved_at,
    status_decays_at: userRow.status_decays_at,
    inactivity_warning,
  });
});

export default tasks;
