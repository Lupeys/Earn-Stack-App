import { Hono } from "hono";
import { getDb } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { fraudSubmitMiddleware } from "../middleware/fraud";
import type { AuthPayload } from "../lib/jwt";

const tasks = new Hono();
tasks.use("*", authMiddleware);

tasks.get("/", (c) => {
  const db = getDb();
  const rows = db.query("SELECT * FROM tasks WHERE status = 'active' ORDER BY created_at DESC").all();
  return c.json({ tasks: rows });
});

tasks.get("/:id", (c) => {
  const db = getDb();
  const row = db.query("SELECT * FROM tasks WHERE id = ? AND status = 'active'").get(c.req.param("id"));
  if (!row) return c.json({ error: "Task not found" }, 404);
  return c.json({ task: row });
});

// Fraud middleware runs BEFORE the submit handler
tasks.post("/:id/submit", fraudSubmitMiddleware, async (c) => {
  const user = c.get("user") as AuthPayload;
  const taskId = c.req.param("id");

  let proof_data = "";
  try {
    const body = await c.req.json();
    proof_data = body?.proof_data || "";
  } catch { /* allow empty body */ }

  const db = getDb();

  const task = db.query("SELECT * FROM tasks WHERE id = ? AND status = 'active'").get(taskId) as any;
  if (!task) return c.json({ error: "Task not found or inactive" }, 404);

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

export default tasks;
