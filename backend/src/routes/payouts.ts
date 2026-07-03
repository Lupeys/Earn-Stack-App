import { Hono } from "hono";
import { getDb } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { fraudPayoutMiddleware } from "../middleware/fraud";
import type { AuthPayload } from "../lib/jwt";

const payouts = new Hono();
payouts.use("*", authMiddleware);

// Fraud middleware runs BEFORE the payout handler
payouts.post("/request", fraudPayoutMiddleware, async (c) => {
  const user = c.get("user") as AuthPayload;
  const { paypal_email, amount_cad } = await c.req.json();
  if (!paypal_email || !amount_cad) {
    return c.json({ error: "PayPal email and amount are required" }, 400);
  }
  if (amount_cad < 5) {
    return c.json({ error: "Minimum payout is $5.00 CAD" }, 400);
  }

  const db = getDb();
  const available = (db.query(
    "SELECT COALESCE(SUM(amount_cad), 0) as total FROM earnings_ledger WHERE user_id = ? AND status = 'cleared'"
  ).get(user.userId) as { total: number }).total;

  if (amount_cad > available) {
    return c.json({ error: "Requested amount exceeds available balance" }, 400);
  }

  db.run(
    "INSERT INTO payout_requests (user_id, paypal_email, amount_cad, status) VALUES (?, ?, ?, 'pending')",
    [user.userId, paypal_email, amount_cad]
  );

  const request = db.query(
    "SELECT * FROM payout_requests WHERE user_id = ? ORDER BY id DESC LIMIT 1"
  ).get(user.userId);

  return c.json({ payout_request: request });
});

payouts.get("/history", (c) => {
  const user = c.get("user") as AuthPayload;
  const db = getDb();
  const rows = db.query(
    "SELECT * FROM payout_requests WHERE user_id = ? ORDER BY requested_at DESC"
  ).all(user.userId);
  return c.json({ payouts: rows });
});

export default payouts;
