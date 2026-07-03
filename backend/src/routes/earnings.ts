import { Hono } from "hono";
import { getDb } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import type { AuthPayload } from "../lib/jwt";

const earnings = new Hono();
earnings.use("*", authMiddleware);

earnings.get("/", (c) => {
  const user = c.get("user") as AuthPayload;
  const db = getDb();

  const ledger = db.query(`
    SELECT el.*, tc.status as completion_status, t.title as task_title
    FROM earnings_ledger el
    JOIN task_completions tc ON el.task_completion_id = tc.id
    JOIN tasks t ON tc.task_id = t.id
    WHERE el.user_id = ?
    ORDER BY el.created_at DESC
  `).all(user.userId);

  const pending = (db.query(
    "SELECT COALESCE(SUM(amount_cad), 0) as total FROM earnings_ledger WHERE user_id = ? AND status = 'pending'"
  ).get(user.userId) as { total: number }).total;

  const cleared = (db.query(
    "SELECT COALESCE(SUM(amount_cad), 0) as total FROM earnings_ledger WHERE user_id = ? AND status = 'cleared'"
  ).get(user.userId) as { total: number }).total;

  return c.json({ ledger, pending_balance: pending, available_balance: cleared, minimum_payout: 5 });
});

earnings.get("/summary", (c) => {
  const user = c.get("user") as AuthPayload;
  const db = getDb();

  const pending = (db.query(
    "SELECT COALESCE(SUM(amount_cad), 0) as total FROM earnings_ledger WHERE user_id = ? AND status = 'pending'"
  ).get(user.userId) as { total: number }).total;

  const cleared = (db.query(
    "SELECT COALESCE(SUM(amount_cad), 0) as total FROM earnings_ledger WHERE user_id = ? AND status = 'cleared'"
  ).get(user.userId) as { total: number }).total;

  const paid = (db.query(
    "SELECT COALESCE(SUM(amount_cad), 0) as total FROM earnings_ledger WHERE user_id = ? AND status = 'paid'"
  ).get(user.userId) as { total: number }).total;

  const completedTasks = (db.query(
    "SELECT COUNT(*) as c FROM task_completions WHERE user_id = ? AND status = 'approved'"
  ).get(user.userId) as { c: number }).c;

  return c.json({ pending_balance: pending, available_balance: cleared, lifetime_earned: paid, completed_tasks: completedTasks, minimum_payout: 5 });
});

export default earnings;
