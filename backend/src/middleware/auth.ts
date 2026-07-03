import { verifyToken, type AuthPayload } from "../lib/jwt";

export async function authMiddleware(c: any, next: any) {
  const header = c.req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const token = header.slice(7);
  const payload = await verifyToken(token);
  if (!payload) return c.json({ error: "Invalid or expired token" }, 401);
  c.set("user", payload);
  return next();
}

export async function adminMiddleware(c: any, next: any) {
  const user = c.get("user") as AuthPayload | null;
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const { getDb } = await import("../db/schema");
  const db = getDb();
  const row = db.query("SELECT role FROM users WHERE id = ?").get(user.userId) as { role: string } | null;
  if (!row || row.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }
  return next();
}
