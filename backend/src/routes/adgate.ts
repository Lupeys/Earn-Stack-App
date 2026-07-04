import { Hono } from "hono";
import { getDb } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/auth";

const adgate = new Hono();

// ─────────────────────────────────────────────────────────────────
// AdGate Offer Feed
//
// AdGate provides an offer API that returns available offers for a
// given app/user. We pull these on a schedule and cache them in
// adgate_offer_cache, then upsert them into the tasks table as
// tier='standard' source='adgate' tasks.
//
// Docs: https://adgatemedia.com/publishers/offer-api
//
// The offer API URL format:
//   https://api.adgaterewards.com/v1/offers?app_id=APP_ID&api_key=API_KEY
//     &country=CA&device=desktop&ip={user_ip}&user_id={user_id}
//
// For the feed pull (server-side, no user context) we pull all CA
// offers and upsert them as tasks. User-specific filtering (device,
// IP) happens at display time via the wall embed.
// ─────────────────────────────────────────────────────────────────

const ADGATE_OFFER_API = "https://api.adgaterewards.com/v1/offers";

// ─────────────────────────────────────────────────────────────────
// normalizeAdGateOffer
// Maps a raw AdGate offer object to our internal task shape.
// Payout from AdGate is in USD cents; we apply a 1.38 CAD/USD
// conversion factor as a conservative estimate (update as needed).
// ─────────────────────────────────────────────────────────────────
function normalizeAdGateOffer(offer: any, userSharePct: number): {
  external_offer_id: string;
  title: string;
  description: string;
  payout_cad: number;
  effort_minutes: number;
  offer_url: string;
  requirements: string;
} {
  const USD_TO_CAD = 1.38;
  const payoutUsdCents = offer.payout ?? offer.points ?? 0;
  const payoutCad = parseFloat(
    ((payoutUsdCents / 100) * USD_TO_CAD * (userSharePct / 100)).toFixed(2)
  );

  // Estimate effort from offer type
  const effortMap: Record<string, number> = {
    survey: 10,
    video: 3,
    app: 8,
    signup: 5,
    purchase: 15,
    trial: 10,
    download: 3,
  };
  const offerType = (offer.offer_type ?? offer.type ?? "").toLowerCase();
  const effort_minutes = Object.entries(effortMap).find(([k]) => offerType.includes(k))?.[1] ?? 5;

  return {
    external_offer_id: String(offer.offer_id ?? offer.id),
    title: offer.name ?? offer.title ?? "Sponsored Offer",
    description: offer.description ?? offer.instructions ?? "",
    payout_cad: payoutCad,
    effort_minutes,
    offer_url: offer.link ?? offer.url ?? "",
    requirements: offer.requirements ?? offer.devices ?? "",
  };
}

// ─────────────────────────────────────────────────────────────────
// syncAdGateOffers
// Core sync logic — exported so it can be called from a cron or
// from the admin trigger endpoint below.
// Returns { inserted, updated, deactivated, errors }
// ─────────────────────────────────────────────────────────────────
export async function syncAdGateOffers(): Promise<{
  inserted: number;
  updated: number;
  deactivated: number;
  errors: string[];
}> {
  const db = getDb();
  const errors: string[] = [];

  // Load AdGate config
  const config = db.query(
    "SELECT api_key, user_share_pct, active FROM sponsor_config WHERE network = 'adgate'"
  ).get() as { api_key: string; user_share_pct: number; active: number } | null;

  if (!config || !config.active) {
    return { inserted: 0, updated: 0, deactivated: 0, errors: ["AdGate is not active in sponsor_config"] };
  }

  if (!config.api_key) {
    return { inserted: 0, updated: 0, deactivated: 0, errors: ["AdGate api_key not configured"] };
  }

  // Fetch offers from AdGate API
  let rawOffers: any[] = [];
  try {
    const url = new URL(ADGATE_OFFER_API);
    url.searchParams.set("api_key", config.api_key);
    url.searchParams.set("country", "CA");
    url.searchParams.set("device", "desktop");

    const res = await fetch(url.toString(), {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return {
        inserted: 0, updated: 0, deactivated: 0,
        errors: [`AdGate API returned ${res.status}: ${await res.text()}`],
      };
    }

    const data = await res.json() as any;
    // AdGate wraps offers in data.offers or returns an array directly
    rawOffers = Array.isArray(data) ? data : (data.offers ?? data.data ?? []);
  } catch (err: any) {
    return { inserted: 0, updated: 0, deactivated: 0, errors: [`Fetch error: ${err.message}`] };
  }

  if (!rawOffers.length) {
    return { inserted: 0, updated: 0, deactivated: 0, errors: ["No offers returned from AdGate"] };
  }

  let inserted = 0;
  let updated = 0;

  const syncedIds: string[] = [];

  for (const raw of rawOffers) {
    try {
      const offer = normalizeAdGateOffer(raw, config.user_share_pct);
      syncedIds.push(offer.external_offer_id);

      // Skip zero-payout offers
      if (offer.payout_cad <= 0) continue;

      // Upsert into adgate_offer_cache
      const existing = db.query(
        "SELECT id FROM adgate_offer_cache WHERE external_offer_id = ?"
      ).get(offer.external_offer_id);

      if (existing) {
        db.run(
          `UPDATE adgate_offer_cache
           SET title = ?, description = ?, payout_cad = ?, effort_minutes = ?,
               offer_url = ?, requirements = ?, active = 1, last_synced_at = datetime('now')
           WHERE external_offer_id = ?`,
          [offer.title, offer.description, offer.payout_cad, offer.effort_minutes,
           offer.offer_url, offer.requirements, offer.external_offer_id]
        );
        // Sync into tasks table
        db.run(
          `UPDATE tasks
           SET title = ?, description = ?, payout_cad = ?, effort_minutes = ?, status = 'active'
           WHERE external_network = 'adgate' AND external_id = ?`,
          [offer.title, offer.description, offer.payout_cad, offer.effort_minutes,
           offer.external_offer_id]
        );
        updated++;
      } else {
        db.run(
          `INSERT INTO adgate_offer_cache
           (external_offer_id, title, description, payout_cad, effort_minutes, offer_url, requirements)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [offer.external_offer_id, offer.title, offer.description, offer.payout_cad,
           offer.effort_minutes, offer.offer_url, offer.requirements]
        );
        // Insert into tasks table as standard tier
        db.run(
          `INSERT INTO tasks
           (title, description, task_type, effort_minutes, payout_cad,
            max_completions, status, source, external_id, external_network, tier, min_contributor_level)
           VALUES (?, ?, 'survey', ?, ?, 0, 'active', 'adgate', ?, 'adgate', 'standard', NULL)`,
          [offer.title, offer.description, offer.effort_minutes, offer.payout_cad,
           offer.external_offer_id]
        );
        inserted++;
      }
    } catch (err: any) {
      errors.push(`Offer ${raw?.offer_id ?? raw?.id}: ${err.message}`);
    }
  }

  // Deactivate offers no longer in the feed
  let deactivated = 0;
  if (syncedIds.length > 0) {
    const placeholders = syncedIds.map(() => "?").join(",");
    const stale = db.query(
      `SELECT external_offer_id FROM adgate_offer_cache
       WHERE external_offer_id NOT IN (${placeholders}) AND active = 1`,
      ...syncedIds
    ).all() as { external_offer_id: string }[];

    for (const row of stale) {
      db.run(
        "UPDATE adgate_offer_cache SET active = 0 WHERE external_offer_id = ?",
        [row.external_offer_id]
      );
      db.run(
        "UPDATE tasks SET status = 'inactive' WHERE external_network = 'adgate' AND external_id = ?",
        [row.external_offer_id]
      );
      deactivated++;
    }
  }

  return { inserted, updated, deactivated, errors };
}

// ─────────────────────────────────────────────────────────────────
// POST /adgate/sync  (admin only)
// Manually triggers an offer feed pull. In production this should
// also be triggered by a cron (e.g. every 6 hours via Bun.cron or
// an external scheduler hitting this endpoint with admin auth).
// ─────────────────────────────────────────────────────────────────
adgate.post("/sync", authMiddleware, adminMiddleware, async (c) => {
  const result = await syncAdGateOffers();
  const status = result.errors.length > 0 && result.inserted === 0 && result.updated === 0
    ? 502
    : 200;
  return c.json(result, status);
});

// ─────────────────────────────────────────────────────────────────
// GET /adgate/offers  (admin only)
// Returns the current offer cache for inspection.
// ─────────────────────────────────────────────────────────────────
adgate.get("/offers", authMiddleware, adminMiddleware, (c) => {
  const db = getDb();
  const offers = db.query(
    "SELECT * FROM adgate_offer_cache ORDER BY payout_cad DESC"
  ).all();
  return c.json({ offers, count: offers.length });
});

export default adgate;
