import { Hono } from "hono";
import { getDb } from "../db/schema";

const POSTBACK_SECRET = process.env.POSTBACK_SECRET || "earnstack-postback-dev-secret";

const postback = new Hono();

function logPostback(db: any, network: string, txId: string, offerId: string, userId: number, payoutCad: number, rawBody: string) {
  db.run(
    `INSERT INTO postback_log (network, external_tx_id, external_offer_id, user_id, payout_cad, raw_body)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [network, txId, offerId, userId, payoutCad, rawBody]
  );
  return db.query("SELECT last_insert_rowid() as id").get() as { id: number };
}

function creditUser(db: any, userId: number, postbackLogId: number, amountCad: number, network: string) {
  try {
    db.run(
      `INSERT INTO sponsor_earnings (user_id, postback_log_id, amount_cad, network, status)
       VALUES (?, ?, ?, ?, 'cleared')`,
      [userId, postbackLogId, amountCad, network]
    );
  } catch (err: any) {
    console.error(`[postback] creditUser failed: user=${userId} logId=${postbackLogId} amount=${amountCad} err=${err.message}`);
    throw err;
  }
}

// ─────────────────────────────────────────────
// TheoremReach postback
// GET /api/postback/theoremreach?user_id=123&reward=1.50&tx_id=abc&offer_id=xyz
// ─────────────────────────────────────────────
postback.get("/theoremreach", (c) => {
  const db = getDb();
  const userId = parseInt(c.req.query("user_id") || "0");
  const reward = parseFloat(c.req.query("reward") || "0");
  const txId = c.req.query("tx_id") || c.req.query("transaction_id") || "";
  const offerId = c.req.query("offer_id") || c.req.query("survey_id") || "";

  if (!userId || !reward || !txId) {
    return c.json({ error: "Missing required params" }, 400);
  }

  const existing = db.query(
    "SELECT id FROM postback_log WHERE external_tx_id = ? AND network = 'theoremreach'"
  ).get(txId);
  if (existing) {
    return c.json({ status: "duplicate", message: "Already processed" });
  }

  const config = db.query(
    "SELECT user_share_pct, active FROM sponsor_config WHERE network = 'theoremreach'"
  ).get() as { user_share_pct: number; active: number } | null;

  if (!config || !config.active) {
    return c.json({ status: "disabled" });
  }

  const userShare = reward * (config.user_share_pct / 100);

  const rawBody = c.req.url;
  const log = logPostback(db, "theoremreach", txId, offerId, userId, reward, rawBody);
  creditUser(db, userId, log.id, userShare, "theoremreach");

  console.log(`[postback] TheoremReach: user=${userId} reward=$${reward} user_share=$${userShare.toFixed(2)}`);

  return c.json({ status: "ok", credited: userShare });
});

// ─────────────────────────────────────────────
// AdGate Media postback
// GET /api/postback/adgate?s1={user_id}&payout={payout}&tx_id={transaction_id}&offer_id={offer_id}&state={state}
// ─────────────────────────────────────────────
postback.get("/adgate", (c) => {
  const db = getDb();
  const userId = parseInt(c.req.query("s1") || c.req.query("user_id") || "0");
  const payout = parseFloat(c.req.query("payout") || "0");
  const txId = c.req.query("tx_id") || c.req.query("transaction_id") || "";
  const offerId = c.req.query("offer_id") || "";
  const state = c.req.query("state") || "approved";

  if (!userId || !payout || !txId) {
    return c.json({ error: "Missing required params" }, 400);
  }

  if (state === "declined" || state === "reversed") {
    console.log(`[postback] AdGate: reversal for tx=${txId}, state=${state}`);
    return c.json({ status: "reversal_acknowledged" });
  }

  const existing = db.query(
    "SELECT id FROM postback_log WHERE external_tx_id = ? AND network = 'adgate'"
  ).get(txId);
  if (existing) {
    return c.json({ status: "duplicate", message: "Already processed" });
  }

  const config = db.query(
    "SELECT user_share_pct, active FROM sponsor_config WHERE network = 'adgate'"
  ).get() as { user_share_pct: number; active: number } | null;

  if (!config || !config.active) {
    return c.json({ status: "disabled" });
  }

  const userShare = payout * (config.user_share_pct / 100);

  const rawBody = c.req.url;
  const log = logPostback(db, "adgate", txId, offerId, userId, payout, rawBody);
  creditUser(db, userId, log.id, userShare, "adgate");

  console.log(`[postback] AdGate: user=${userId} payout=$${payout} user_share=$${userShare.toFixed(2)}`);

  return c.json({ status: "ok", credited: userShare });
});

// ─────────────────────────────────────────────
// Config endpoint (admin-only, uses shared secret)
// GET /api/postback/config?network=theoremreach
// PUT /api/postback/config
// ─────────────────────────────────────────────
postback.get("/config", (c) => {
  const secret = c.req.header("x-postback-secret");
  if (secret !== POSTBACK_SECRET) return c.json({ error: "Unauthorized" }, 401);

  const network = c.req.query("network");
  const db = getDb();

  if (network) {
    const row = db.query("SELECT * FROM sponsor_config WHERE network = ?").get(network);
    return c.json({ config: row });
  }

  const rows = db.query("SELECT * FROM sponsor_config").all();
  return c.json({ configs: rows });
});

postback.put("/config", async (c) => {
  const secret = c.req.header("x-postback-secret");
  if (secret !== POSTBACK_SECRET) return c.json({ error: "Unauthorized" }, 401);

  const db = getDb();
  const body = await c.req.json();
  const { network, user_share_pct, active, api_key, wall_code } = body;

  if (!network) return c.json({ error: "network is required" }, 400);

  if (user_share_pct !== undefined) {
    db.run("UPDATE sponsor_config SET user_share_pct = ? WHERE network = ?", [user_share_pct, network]);
  }
  if (active !== undefined) {
    db.run("UPDATE sponsor_config SET active = ? WHERE network = ?", [active ? 1 : 0, network]);
  }
  if (api_key !== undefined) {
    db.run("UPDATE sponsor_config SET api_key = ? WHERE network = ?", [api_key, network]);
  }
  if (wall_code !== undefined) {
    db.run("UPDATE sponsor_config SET wall_code = ? WHERE network = ?", [wall_code, network]);
  }

  const updated = db.query("SELECT * FROM sponsor_config WHERE network = ?").get(network);
  return c.json({ config: updated });
});

// ─────────────────────────────────────────────
// Earnings summary (for user dashboard)
// GET /api/postback/earnings?user_id=123
// ─────────────────────────────────────────────
postback.get("/earnings", (c) => {
  const db = getDb();
  const userId = parseInt(c.req.query("user_id") || "0");

  if (!userId) {
    return c.json({ error: "user_id required" }, 400);
  }

  const rows = db.query(
    `SELECT se.*, pl.external_offer_id, pl.network, pl.created_at as completed_at
     FROM sponsor_earnings se
     JOIN postback_log pl ON se.postback_log_id = pl.id
     WHERE se.user_id = ?
     ORDER BY se.created_at DESC`,
  ).all(userId);

  const total = (db.query(
    "SELECT COALESCE(SUM(amount_cad), 0) as total FROM sponsor_earnings WHERE user_id = ? AND status = 'cleared'"
  ).get(userId) as { total: number }).total;

  return c.json({ earnings: rows, total });
});

export default postback;
