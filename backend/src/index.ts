import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { getDb, seed } from "./db/schema";
import auth from "./routes/auth";
import tasks from "./routes/tasks";
import earnings from "./routes/earnings";
import payouts from "./routes/payouts";
import admin from "./routes/admin";
import verify from "./routes/verify";

const app = new Hono();

app.use("*", cors({ origin: ["https://earnstack.ca", "http://localhost:3000", "http://localhost:5173"] }));
app.use("*", logger());

app.get("/api/health", (c) => c.json({ status: "ok", app: "EarnStack", version: "0.2.0" }));
app.get("/api/debug/env", (c) => c.json(process.env));

app.route("/api/auth", auth);
app.route("/api/tasks", tasks);
app.route("/api/earnings", earnings);
app.route("/api/payouts", payouts);
app.route("/api/admin", admin);
app.route("/api/verify", verify);

const db = getDb();
seed(db);

export default {
  port: Number(process.env.PORT) || 3001,
  fetch: app.fetch,
};
