import { Hono } from "hono";
import { getDb } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { sendVerificationEmail } from "../lib/email";
import type { AuthPayload } from "../lib/jwt";

const verify = new Hono();

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

verify.post("/send", authMiddleware, async (c) => {
  const user = c.get("user") as AuthPayload;
  const db = getDb();

  const u = db.query("SELECT verified FROM users WHERE id = ?").get(user.userId) as any;
  if (!u) return c.json({ error: "User not found" }, 404);
  if (u.verified) return c.json({ error: "Already verified" }, 400);

  db.run("DELETE FROM verification_codes WHERE user_id = ?", [user.userId]);

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  db.run(
    "INSERT INTO verification_codes (user_id, code, expires_at) VALUES (?, ?, ?)",
    [user.userId, code, expiresAt]
  );

  const sent = await sendVerificationEmail(user.email, code);

  return c.json({ sent, message: sent ? "Verification code sent" : "Failed to send code. Try again." });
});

verify.post("/", authMiddleware, async (c) => {
  const user = c.get("user") as AuthPayload;
  const db = getDb();

  let code = "";
  try {
    const body = await c.req.json();
    code = body?.code || "";
  } catch {
    return c.json({ error: "Code is required" }, 400);
  }

  if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
    return c.json({ error: "Invalid code format" }, 400);
  }

  const entry = db.query(
    `SELECT * FROM verification_codes
     WHERE user_id = ? AND code = ? AND used = 0 AND expires_at > datetime('now')
     ORDER BY id DESC LIMIT 1`
  ).get(user.userId, code) as any;

  if (!entry) {
    return c.json({ error: "Invalid or expired code" }, 400);
  }

  db.run("UPDATE verification_codes SET used = 1 WHERE id = ?", [entry.id]);
  db.run("UPDATE users SET verified = 1 WHERE id = ?", [user.userId]);

  return c.json({ verified: true });
});

export default verify;
