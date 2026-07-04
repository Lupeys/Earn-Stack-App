import type { Context, Next } from "hono";
import { getDb } from "../db/schema";
import type { AuthPayload } from "../lib/jwt";

// ─────────────────────────────────────────────────────────────────
// Contributor level definitions
// ─────────────────────────────────────────────────────────────────

export type ContributorLevel = "new" | "reliable" | "verified_contributor";

const LEVEL_RANK: Record<ContributorLevel, number> = {
  new: 0,
  reliable: 1,
  verified_contributor: 2,
};

// Thresholds for first-time level advancement (lifetime approved completions)
const FIRST_TIME_THRESHOLDS: Record<ContributorLevel, number> = {
  new: 0,
  reliable: 5,           // 5 approved completions → Reliable
  verified_contributor: 15, // 15 approved completions (cumulative) → Verified Contributor
};

// Thresholds for reinstatement after decay (faster than first-time)
const REINSTATE_THRESHOLDS: Record<ContributorLevel, number> = {
  new: 0,
  reliable: 2,           // 2 approved completions restores Reliable
  verified_contributor: 5, // 5 approved completions restores Verified Contributor
};

// Inactivity window before status begins to decay
const INACTIVITY_DAYS = 60;

// ─────────────────────────────────────────────────────────────────
// evaluateContributorLevel
// Called after any completion is approved. Reads the user's current
// state and advances or reinstates their level as appropriate.
// ─────────────────────────────────────────────────────────────────
export function evaluateContributorLevel(userId: number): void {
  const db = getDb();

  const user = db.query(
    "SELECT contributor_level, reliability_score, last_approved_at, status_decays_at FROM users WHERE id = ?"
  ).get(userId) as {
    contributor_level: ContributorLevel;
    reliability_score: number;
    last_approved_at: string | null;
    status_decays_at: string | null;
  } | null;

  if (!user) return;

  const approvedCount = (db.query(
    "SELECT COUNT(*) as cnt FROM task_completions WHERE user_id = ? AND status = 'approved'"
  ).get(userId) as { cnt: number }).cnt;

  const now = new Date();
  const decaysAt = new Date(now.getTime() + INACTIVITY_DAYS * 24 * 60 * 60 * 1000);
  const decaysAtISO = decaysAt.toISOString();

  let targetLevel: ContributorLevel = user.contributor_level;

  // Determine if this is a reinstatement (user previously held a higher level
  // that decayed) or a first-time advancement.
  //
  // We use reliability_score (lifetime approved count, never decrements) to
  // distinguish new earners from returning ones:
  //   - If reliability_score > first-time threshold for the NEXT level, the
  //     user has been here before — use the faster reinstatement path.
  //   - Otherwise use the standard first-time thresholds.

  const nextLevel: ContributorLevel | null =
    user.contributor_level === "new" ? "reliable" :
    user.contributor_level === "reliable" ? "verified_contributor" : null;

  if (nextLevel) {
    const firstTime = FIRST_TIME_THRESHOLDS[nextLevel];
    const reinstate = REINSTATE_THRESHOLDS[nextLevel];

    // Has the user previously passed the first-time threshold for the next level?
    const isPreviousHolder = user.reliability_score > firstTime;

    const threshold = isPreviousHolder ? reinstate : firstTime;

    if (approvedCount >= threshold) {
      targetLevel = nextLevel;
    }
  }

  db.run(
    `UPDATE users
     SET contributor_level   = ?,
         reliability_score   = ?,
         last_approved_at    = ?,
         status_decays_at    = ?
     WHERE id = ?`,
    [targetLevel, approvedCount, now.toISOString(), decaysAtISO, userId]
  );
}

// ─────────────────────────────────────────────────────────────────
// applyInactivityDecay
// Called on every authenticated request (cheaply). Checks if the
// user's status_decays_at has passed and downgrades their level.
// Verified Contributor → Reliable (not back to New).
// Reliable → New only if they have never reached Verified Contributor
// and have been inactive for 2× the standard window.
// ─────────────────────────────────────────────────────────────────
export function applyInactivityDecay(userId: number): void {
  const db = getDb();

  const user = db.query(
    "SELECT contributor_level, reliability_score, status_decays_at FROM users WHERE id = ?"
  ).get(userId) as {
    contributor_level: ContributorLevel;
    reliability_score: number;
    status_decays_at: string | null;
  } | null;

  if (!user || !user.status_decays_at) return;
  if (user.contributor_level === "new") return;

  const now = new Date();
  const decaysAt = new Date(user.status_decays_at);
  if (now < decaysAt) return;

  let decayedLevel: ContributorLevel = user.contributor_level;

  if (user.contributor_level === "verified_contributor") {
    // Always decays to Reliable, never back to New
    decayedLevel = "reliable";
  } else if (user.contributor_level === "reliable") {
    // Only drops to New if they never earned enough to reach Verified Contributor
    const neverReachedVerified = user.reliability_score < FIRST_TIME_THRESHOLDS["verified_contributor"];
    const doubleWindow = new Date(decaysAt.getTime() + INACTIVITY_DAYS * 24 * 60 * 60 * 1000);
    if (neverReachedVerified && now > doubleWindow) {
      decayedLevel = "new";
    }
  }

  if (decayedLevel !== user.contributor_level) {
    db.run(
      "UPDATE users SET contributor_level = ?, status_decays_at = NULL WHERE id = ?",
      [decayedLevel, userId]
    );
  }
}

// ─────────────────────────────────────────────────────────────────
// contributorDecayMiddleware
// Lightweight middleware — runs on every authenticated route.
// Applies inactivity decay if the user's window has passed.
// Does NOT block the request.
// ─────────────────────────────────────────────────────────────────
export async function contributorDecayMiddleware(c: Context, next: Next) {
  const user = c.get("user") as AuthPayload | undefined;
  if (user?.userId) {
    applyInactivityDecay(user.userId);
  }
  await next();
}

// ─────────────────────────────────────────────────────────────────
// requireContributorLevel
// Returns a middleware that blocks access if the user's current
// contributor level is below the required level.
// ─────────────────────────────────────────────────────────────────
export function requireContributorLevel(required: ContributorLevel) {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as AuthPayload | undefined;
    if (!user?.userId) return c.json({ error: "Unauthorised" }, 401);

    const db = getDb();
    const row = db.query(
      "SELECT contributor_level FROM users WHERE id = ?"
    ).get(user.userId) as { contributor_level: ContributorLevel } | null;

    if (!row) return c.json({ error: "User not found" }, 404);

    if (LEVEL_RANK[row.contributor_level] < LEVEL_RANK[required]) {
      return c.json(
        {
          error: "Premium access required",
          required_level: required,
          current_level: row.contributor_level,
          message:
            required === "reliable"
              ? "This task requires Reliable contributor status. Complete more standard tasks with a clean review record to unlock it."
              : "This task requires Verified Contributor status. Keep completing approved tasks to restore or earn this level.",
        },
        403
      );
    }

    await next();
  };
}
