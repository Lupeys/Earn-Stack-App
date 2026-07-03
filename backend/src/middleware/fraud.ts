/**
 * Anti-Fraud Middleware — EarnStack
 *
 * Guards POST /tasks/:id/submit and POST /payouts/request.
 * Uses only the existing fraud_flags + task_completions + payout_requests
 * tables — zero new dependencies.
 *
 * Rules enforced:
 *   VELOCITY_COMPLETIONS — same user submits > 5 tasks within any 60-min window → block
 *   VELOCITY_PAYOUTS     — same user requests > 2 payouts within any 24-hr window  → block
 *   DUPLICATE_PROOF      — proof_data identical to a prior submission by any user    → flag + block
 *   RAPID_FIRE           — any new submission < 60 seconds after the user's last one → flag (soft warn)
 */

import type { Context } from "hono";
import { getDb } from "../db/schema";
import type { AuthPayload } from "../lib/jwt";

// ─────────────────────────────────────────────
// Configurable thresholds
// ─────────────────────────────────────────────
const COMPLETION_LIMIT_PER_HOUR = 5;  // max task submissions per user per 60 min
const PAYOUT_LIMIT_PER_DAY      = 2;  // max payout requests per user per 24 h
const RAPID_FIRE_SECONDS        = 60; // warn if user submits again within this many seconds

// ─────────────────────────────────────────────
// Helper: write a fraud_flags row
// ─────────────────────────────────────────────
function flagUser(
  userId: number,
  flagType: string,
  severity: "low" | "medium" | "high",
  details: string
) {
  try {
    const db = getDb();
    db.run(
      "INSERT INTO fraud_flags (user_id, flag_type, severity, details) VALUES (?, ?, ?, ?)",
      [userId, flagType, severity, details]
    );
  } catch {
    // never let fraud logging crash the request
  }
}

// ─────────────────────────────────────────────
// Middleware: task submission guard
// ─────────────────────────────────────────────
export async function fraudSubmitMiddleware(c: Context, next: () => Promise<void>) {
  const user = c.get("user") as AuthPayload;
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const db  = getDb();
  const now = Math.floor(Date.now() / 1000);

  // ── 1. Velocity: completions in the last hour
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recentCompletions = (db.query(
    "SELECT COUNT(*) as c FROM task_completions WHERE user_id = ? AND submitted_at > ?"
  ).get(user.userId, hourAgo) as { c: number }).c;

  if (recentCompletions >= COMPLETION_LIMIT_PER_HOUR) {
    flagUser(user.userId, "VELOCITY_COMPLETIONS", "high",
      `${recentCompletions} submissions in the last 60 minutes (limit: ${COMPLETION_LIMIT_PER_HOUR})`);
    return c.json(
      { error: "Too many submissions. Please wait before submitting another task." },
      429
    );
  }

  // ── 2. Rapid-fire detection: last submission < RAPID_FIRE_SECONDS ago
  const lastSub = db.query(
    "SELECT submitted_at FROM task_completions WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1"
  ).get(user.userId) as { submitted_at: string } | null;

  if (lastSub) {
    const secondsSinceLast = now - Math.floor(new Date(lastSub.submitted_at).getTime() / 1000);
    if (secondsSinceLast < RAPID_FIRE_SECONDS) {
      flagUser(user.userId, "RAPID_FIRE", "low",
        `Submitted again ${secondsSinceLast}s after previous submission (threshold: ${RAPID_FIRE_SECONDS}s)`);
      // soft warn only — we do NOT block here, just log
    }
  }

  // ── 3. Duplicate proof_data check
  let body: Record<string, unknown> = {};
  try {
    body = await c.req.json();
    // Re-attach the parsed body so downstream handlers can still read it
    c.req.raw = new Request(c.req.raw, {
      body: JSON.stringify(body),
      duplex: "half" as any,
    });
  } catch { /* ignore non-JSON or empty bodies */ }

  const proofData = typeof body?.proof_data === "string" ? body.proof_data.trim() : "";
  if (proofData.length > 10) {
    const dupProof = db.query(
      "SELECT id FROM task_completions WHERE proof_data = ? AND user_id != ? LIMIT 1"
    ).get(proofData, user.userId);
    if (dupProof) {
      flagUser(user.userId, "DUPLICATE_PROOF", "high",
        `proof_data matches an existing submission by another user (completion_id: ${(dupProof as any).id})`);
      return c.json(
        { error: "Duplicate submission detected. Your account has been flagged for review." },
        409
      );
    }
  }

  await next();
}

// ─────────────────────────────────────────────
// Middleware: payout request guard
// ─────────────────────────────────────────────
export async function fraudPayoutMiddleware(c: Context, next: () => Promise<void>) {
  const user = c.get("user") as AuthPayload;
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const db = getDb();

  // ── Velocity: payout requests in the last 24 hours
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recentPayouts = (db.query(
    "SELECT COUNT(*) as c FROM payout_requests WHERE user_id = ? AND requested_at > ?"
  ).get(user.userId, dayAgo) as { c: number }).c;

  if (recentPayouts >= PAYOUT_LIMIT_PER_DAY) {
    flagUser(user.userId, "VELOCITY_PAYOUTS", "medium",
      `${recentPayouts} payout requests in the last 24 hours (limit: ${PAYOUT_LIMIT_PER_DAY})`);
    return c.json(
      { error: "Too many payout requests. You may request a maximum of 2 payouts per day." },
      429
    );
  }

  await next();
}
