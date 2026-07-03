import { Hono } from "hono";
import { getDb } from "../db/schema";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const admin = new Hono();
admin.use("*", authMiddleware);
admin.use("*", adminMiddleware);

admin.get("/submissions", (c) => {
  const db = getDb();
  const rows = db.query(`
    SELECT tc.*, u.email as user_email, u.display_name, t.title as task_title
    FROM task_completions tc
    JOIN users u ON tc.user_id = u.id
    JOIN tasks t ON tc.task_id = t.id
    WHERE tc.status = 'pending_review'
    ORDER BY tc.submitted_at DESC
  `).all();
  return c.json({ submissions: rows });
});

admin.put("/submissions/:id", async (c) => {
  const id = c.req.param("id");
  const { status, notes } = await c.req.json();
  if (!status || !["approved", "rejected", "flagged"].includes(status)) {
    return c.json({ error: "Status must be approved, rejected, or flagged" }, 400);
  }

  const db = getDb();
  const sub = db.query("SELECT * FROM task_completions WHERE id = ?").get(id) as any;
  if (!sub) return c.json({ error: "Submission not found" }, 404);

  db.run(
    "UPDATE task_completions SET status = ?, reviewer_notes = ?, reviewed_at = datetime('now') WHERE id = ?",
    [status, notes || null, id]
  );

  if (status === "approved") {
    const task = db.query("SELECT payout_cad FROM tasks WHERE id = ?").get(sub.task_id) as { payout_cad: number } | null;
    const amount = task?.payout_cad || 0;

    const existing = db.query(
      "SELECT id FROM earnings_ledger WHERE task_completion_id = ?"
    ).get(sub.id);
    if (!existing) {
      db.run(
        "INSERT INTO earnings_ledger (user_id, task_completion_id, amount_cad, status) VALUES (?, ?, ?, 'pending')",
        [sub.user_id, sub.id, amount]
      );
    }
  }

  return c.json({ success: true });
});

admin.get("/payouts", (c) => {
  const db = getDb();
  const rows = db.query(`
    SELECT pr.*, u.email as user_email, u.display_name
    FROM payout_requests pr
    JOIN users u ON pr.user_id = u.id
    WHERE pr.status = 'pending'
    ORDER BY pr.requested_at DESC
  `).all();
  return c.json({ payouts: rows });
});

admin.put("/payouts/:id", async (c) => {
  const id = c.req.param("id");
  const { status, notes } = await c.req.json();
  if (!status || !["approved", "rejected", "pending"].includes(status)) {
    return c.json({ error: "Invalid status" }, 400);
  }

  const db = getDb();
  const req = db.query("SELECT * FROM payout_requests WHERE id = ?").get(id) as any;
  if (!req) return c.json({ error: "Payout request not found" }, 404);

  const newStatus = status === "approved" ? "completed" : "rejected";
  db.run(
    "UPDATE payout_requests SET status = ?, reviewer_notes = ?, processed_at = datetime('now') WHERE id = ?",
    [newStatus, notes || null, id]
  );

  if (status === "approved") {
    db.run(
      "UPDATE earnings_ledger SET status = 'paid', released_at = datetime('now') WHERE user_id = ? AND status = 'cleared'",
      [req.user_id]
    );
  }

  return c.json({ success: true });
});

admin.get("/tasks", (c) => {
  const db = getDb();
  const rows = db.query("SELECT * FROM tasks ORDER BY created_at DESC").all();
  return c.json({ tasks: rows });
});

admin.post("/tasks", async (c) => {
  const { title, description, task_type, effort_minutes, payout_cad, deadline, max_completions } = await c.req.json();
  if (!title || !task_type) {
    return c.json({ error: "Title and task type are required" }, 400);
  }
  const db = getDb();
  db.run(
    "INSERT INTO tasks (sponsor_id, title, description, task_type, effort_minutes, payout_cad, deadline, max_completions, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')",
    [1, title, description || "", task_type, effort_minutes || 10, payout_cad || 1, deadline || null, max_completions || 0]
  );
  const task = db.query("SELECT * FROM tasks ORDER BY id DESC LIMIT 1").get();
  return c.json({ task });
});

admin.put("/tasks/:id", async (c) => {
  const id = c.req.param("id");
  const { title, description, task_type, effort_minutes, payout_cad, deadline, max_completions, status } = await c.req.json();
  const db = getDb();
  const existing = db.query("SELECT * FROM tasks WHERE id = ?").get(id);
  if (!existing) return c.json({ error: "Task not found" }, 404);

  db.run(
    "UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), task_type = COALESCE(?, task_type), effort_minutes = COALESCE(?, effort_minutes), payout_cad = COALESCE(?, payout_cad), deadline = COALESCE(?, deadline), max_completions = COALESCE(?, max_completions), status = COALESCE(?, status) WHERE id = ?",
    [title, description, task_type, effort_minutes, payout_cad, deadline, max_completions, status, id]
  );
  return c.json({ success: true });
});

export default admin;
