import { Database } from "bun:sqlite";
import { join } from "node:path";

const DB_PATH = join(import.meta.dirname, "..", "..", "..", "data", "earnstack.db");

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    const dir = join(import.meta.dirname, "..", "..", "..", "data");
    Bun.spawnSync({ cmd: ["mkdir", "-p", dir] });
    db = new Database(DB_PATH);
    db.run("PRAGMA journal_mode = WAL");
    db.run("PRAGMA foreign_keys = ON");
    migrate(db);
  }
  return db;
}

function migrate(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      verified INTEGER NOT NULL DEFAULT 0,
      verification_method TEXT DEFAULT 'email',
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sponsor_id INTEGER,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      task_type TEXT NOT NULL DEFAULT 'other',
      effort_minutes INTEGER NOT NULL,
      payout_cad REAL NOT NULL,
      deadline TEXT,
      max_completions INTEGER NOT NULL DEFAULT 0,
      current_completions INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS task_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL REFERENCES tasks(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      proof_data TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending_review',
      reviewer_notes TEXT,
      submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
      reviewed_at TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS earnings_ledger (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      task_completion_id INTEGER NOT NULL REFERENCES task_completions(id),
      amount_cad REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      released_at TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS payout_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      paypal_email TEXT NOT NULL,
      amount_cad REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      reviewer_notes TEXT,
      requested_at TEXT NOT NULL DEFAULT (datetime('now')),
      processed_at TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS fraud_flags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      flag_type TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'low',
      details TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      resolved INTEGER NOT NULL DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      code TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ── Sponsor network integration (v0.3)
  const addColumn = (table: string, col: string, def: string) => {
    try { db.run(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`); } catch { /* already exists */ }
  };
  addColumn("tasks", "source", "TEXT NOT NULL DEFAULT 'manual'");
  addColumn("tasks", "external_id", "TEXT DEFAULT ''");
  addColumn("tasks", "external_network", "TEXT DEFAULT ''");

  db.run(`
    CREATE TABLE IF NOT EXISTS postback_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      network TEXT NOT NULL,
      external_tx_id TEXT NOT NULL,
      external_offer_id TEXT NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id),
      payout_cad REAL NOT NULL,
      raw_body TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'processed',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sponsor_earnings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      postback_log_id INTEGER NOT NULL REFERENCES postback_log(id),
      amount_cad REAL NOT NULL,
      network TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'cleared',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ── Sponsor margin config (default 30% — user gets 70%)
  db.run(`
    CREATE TABLE IF NOT EXISTS sponsor_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      network TEXT NOT NULL UNIQUE,
      user_share_pct REAL NOT NULL DEFAULT 70.0,
      active INTEGER NOT NULL DEFAULT 1,
      api_key TEXT NOT NULL DEFAULT '',
      wall_code TEXT NOT NULL DEFAULT ''
    )
  `);

  const configCount = (db.query("SELECT COUNT(*) as c FROM sponsor_config").get() as {c: number}).c;
  if (configCount === 0) {
    db.run("INSERT INTO sponsor_config (network, user_share_pct, active) VALUES ('theoremreach', 70.0, 0)");
    db.run("INSERT INTO sponsor_config (network, user_share_pct, active) VALUES ('adgate', 70.0, 0)");
  }
}

// ─────────────────────────────────────────────
// Seed — runs once on startup if tables are empty
// ─────────────────────────────────────────────
export async function seed(db: Database) {
  // ── 1. Admin user
  const adminExists = db.query("SELECT id FROM users WHERE role = 'admin'").get();
  if (!adminExists) {
    const adminHash = await Bun.password.hash("admin123", { algorithm: "bcrypt", cost: 12 });
    db.run(
      "INSERT INTO users (email, password_hash, display_name, role, verified) VALUES (?, ?, ?, ?, ?)",
      ["admin@earnstack.ca", adminHash, "EarnStack Admin", "admin", 1]
    );
  }

  // ── 2. Worker users (3 realistic Canadians)
  const workerCount = (db.query("SELECT COUNT(*) as c FROM users WHERE role = 'user'").get() as { c: number }).c;
  if (workerCount === 0) {
    const workerHash = await Bun.password.hash("worker123", { algorithm: "bcrypt", cost: 12 });
    const workers = [
      ["sarah.chen@gmail.com",    workerHash, "Sarah Chen",    "user", 1],
      ["marcus.obrien@outlook.com", workerHash, "Marcus O'Brien", "user", 1],
      ["priya.nair@hotmail.com",  workerHash, "Priya Nair",    "user", 0],
    ];
    const wStmt = db.prepare(
      "INSERT INTO users (email, password_hash, display_name, role, verified) VALUES (?, ?, ?, ?, ?)"
    );
    for (const w of workers) wStmt.run(...w);
  }

  // ── 3. Tasks (12 tasks across all task_types)
  const taskCount = (db.query("SELECT COUNT(*) as c FROM tasks").get() as { c: number }).c;
  if (taskCount === 0) {
    // [title, description, task_type, effort_minutes, payout_cad, max_completions, status]
    const taskRows = [
      // survey
      ["Canadian Grocery Habits Survey", "Answer 20 questions about your weekly grocery shopping. Anonymous, takes ~10 minutes.", "survey", 10, 2.00, 50, "active"],
      ["Tech Adoption in Canada – 2026", "15 multiple-choice questions on how Canadians use smartphones and apps. Fully anonymous.", "survey", 8, 1.75, 100, "active"],
      ["Home Internet Satisfaction Survey", "Rate your ISP and broadband experience. 12 questions.", "survey", 6, 1.50, 75, "active"],
      // app_test
      ["Test a Canadian Weather App", "Install our iOS/Android weather app, complete the 5-step onboarding, and report any bugs via the in-app form.", "app_test", 15, 3.50, 10, "active"],
      ["E-commerce Usability Test", "Try to find 3 specific products on our Canadian retailer site. Record your screen if possible.", "app_test", 12, 3.00, 20, "active"],
      ["Accessibility Audit – Banking App", "Navigate 4 core screens in our mobile banking prototype using only screen-reader mode. Report friction points.", "app_test", 20, 5.00, 8, "active"],
      // promo_action
      ["Watch & Review a Product Demo", "Watch a 2-minute promo for a Canadian fintech app and write 3 sentences of honest feedback.", "promo_action", 5, 1.25, 30, "active"],
      ["Follow & Engage on Instagram", "Follow @EarnStackCA, like 3 posts, and leave a genuine comment. Screenshot required as proof.", "promo_action", 4, 1.00, 50, "active"],
      // data_entry
      ["Menu Data Entry – Local Restaurants", "Transcribe menu items and prices from 5 provided photos into a shared spreadsheet.", "data_entry", 25, 4.00, 15, "active"],
      ["Receipt Digitization", "Photograph and transcribe 10 grocery receipts into a structured CSV template. Provided by sponsor.", "data_entry", 30, 4.50, 10, "active"],
      // other
      ["Write a Product Review", "Purchase or use a free trial of our SaaS tool and write an honest 150-word review for a Canadian tech forum.", "other", 20, 6.00, 5, "active"],
      ["Draft Task — Coming Soon", "This task is being prepared by our team. Check back soon.", "other", 10, 2.00, 0, "draft"],
    ];
    const tStmt = db.prepare(
      "INSERT INTO tasks (sponsor_id, title, description, task_type, effort_minutes, payout_cad, max_completions, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    for (const t of taskRows) tStmt.run(1, ...t);
  }

  // ── 4. Sample completions + earnings — only if completions table is empty
  const compCount = (db.query("SELECT COUNT(*) as c FROM task_completions").get() as { c: number }).c;
  if (compCount === 0) {
    // Get the seeded user IDs in order
    const userRows = db.query(
      "SELECT id FROM users WHERE role = 'user' ORDER BY id ASC LIMIT 3"
    ).all() as { id: number }[];
    const taskRows = db.query(
      "SELECT id, payout_cad FROM tasks WHERE status = 'active' ORDER BY id ASC LIMIT 6"
    ).all() as { id: number; payout_cad: number }[];

    if (userRows.length >= 2 && taskRows.length >= 5) {
      const [sarah, marcus, priya] = [userRows[0].id, userRows[1].id, userRows[2]?.id ?? userRows[1].id];

      // [task_id, user_id, proof_data, status]
      const completions = [
        [taskRows[0].id, sarah,  "Survey completed via link, confirmation code: CA-5821", "approved"],
        [taskRows[1].id, sarah,  "Survey submitted at 14:32 PST, confirmation: TCA-9104", "approved"],
        [taskRows[2].id, marcus, "Completed survey, screenshot attached in notes",         "approved"],
        [taskRows[3].id, marcus, "App tested on iPhone 14 iOS 18.2 — found 2 bugs, reported via form", "pending_review"],
        [taskRows[4].id, priya,  "Tested on Samsung Galaxy S24, all 3 products found successfully", "pending_review"],
        [taskRows[0].id, priya,  "Survey completed, code: CA-7743",                         "rejected"],
      ];

      const cStmt = db.prepare(
        "INSERT INTO task_completions (task_id, user_id, proof_data, status, reviewed_at) VALUES (?, ?, ?, ?, ?)"
      );
      for (const comp of completions) {
        const reviewed = (comp[3] === "approved" || comp[3] === "rejected")
          ? new Date().toISOString()
          : null;
        cStmt.run(comp[0], comp[1], comp[2], comp[3], reviewed);
      }

      // ── 5. Earnings ledger for approved completions
      const approved = db.query(
        "SELECT tc.id, tc.user_id, tc.task_id, t.payout_cad FROM task_completions tc JOIN tasks t ON tc.task_id = t.id WHERE tc.status = 'approved'"
      ).all() as { id: number; user_id: number; task_id: number; payout_cad: number }[];

      const eStmt = db.prepare(
        "INSERT INTO earnings_ledger (user_id, task_completion_id, amount_cad, status) VALUES (?, ?, ?, ?)"
      );
      for (const a of approved) {
        // Sarah's first earning is 'cleared' (ready to withdraw), second is 'pending'
        const status = a.user_id === sarah ? (approved.indexOf(a) === 0 ? "cleared" : "pending") : "cleared";
        eStmt.run(a.user_id, a.id, a.payout_cad, status);
      }

      // ── 6. One pending payout request from Sarah (she has cleared balance)
      const sarahCleared = (db.query(
        "SELECT COALESCE(SUM(amount_cad), 0) as total FROM earnings_ledger WHERE user_id = ? AND status = 'cleared'"
      ).get(sarah) as { total: number }).total;

      if (sarahCleared >= 5) {
        db.run(
          "INSERT INTO payout_requests (user_id, paypal_email, amount_cad, status) VALUES (?, ?, ?, 'pending')",
          [sarah, "sarah.chen@gmail.com", sarahCleared]
        );
      }

      // ── 7. One sample fraud flag (for Priya's rejected submission)
      db.run(
        "INSERT INTO fraud_flags (user_id, flag_type, severity, details) VALUES (?, ?, ?, ?)",
        [priya, "DUPLICATE_PROOF", "low", "Proof code CA-7743 was similar to another submission. Auto-flagged for review."]
      );
    }
  }
}
