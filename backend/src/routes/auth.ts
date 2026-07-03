import { Hono } from "hono";
import { hashPassword, verifyPassword, createToken, getUserByEmail, getUserById, verifyToken } from "../lib/jwt";
import { getDb } from "../db/schema";

const auth = new Hono();

auth.post("/register", async (c) => {
  const { email, password, display_name } = await c.req.json();
  if (!email || !password || !display_name) {
    return c.json({ error: "Email, password, and display name are required" }, 400);
  }
  if (password.length < 8) {
    return c.json({ error: "Password must be at least 8 characters" }, 400);
  }

  const db = getDb();
  const existing = db.query("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return c.json({ error: "An account with this email already exists" }, 409);
  }

  const password_hash = await hashPassword(password);
  db.run(
    "INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)",
    [email, password_hash, display_name]
  );
  const user = db.query("SELECT id, email, display_name, verified FROM users WHERE email = ?").get(email) as any;

  const token = await createToken({ userId: user.id, email: user.email });
  return c.json({ token, user: { id: user.id, email: user.email, display_name: user.display_name, verified: !!user.verified } });
});

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const db = getDb();
  const user = getUserByEmail(db, email);
  if (!user) return c.json({ error: "Invalid email or password" }, 401);

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return c.json({ error: "Invalid email or password" }, 401);

  const token = await createToken({ userId: user.id, email: user.email });
  return c.json({ token, user: { id: user.id, email: user.email, display_name: user.display_name, verified: !!user.verified } });
});

auth.get("/me", async (c) => {
  const header = c.req.header("authorization");
  if (!header?.startsWith("Bearer ")) return c.json({ error: "Unauthorized" }, 401);

  const payload = await verifyToken(header.slice(7));
  if (!payload) return c.json({ error: "Invalid token" }, 401);

  const db = getDb();
  const user = getUserById(db, payload.userId);
  if (!user) return c.json({ error: "User not found" }, 404);

  return c.json({ user });
});

export default auth;
