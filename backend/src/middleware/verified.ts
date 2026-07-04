import type { Context, Next } from "hono";
import type { AuthPayload } from "../lib/jwt";
import { getDb } from "../db/schema";

export async function requireVerified(c: Context, next: Next) {
  const user = c.get("user") as AuthPayload;
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const db = getDb();
  const row = db.query("SELECT verified FROM users WHERE id = ?").get(user.userId) as any;

  if (!row || !row.verified) {
    return c.json({ error: "Email verification required. Please verify your account.", code: "UNVERIFIED" }, 403);
  }

  await next();
}
