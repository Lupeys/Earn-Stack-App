import { Database } from "bun:sqlite";
import { join } from "node:path";

const DB_PATH = join(import.meta.dirname, "..", "..", "..", "data", "earnstack.db");

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    import.meta.dir;
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
}

export function seed(db: Database) {
  const adminExists = db.query("SELECT id FROM users WHERE role = 'admin'").get();
  if (!adminExists) {
    Bun.password.hash("admin123").then((hash) => {
      db.run(
        "INSERT INTO users (email, password_hash, display_name, role, verified) VALUES (?, ?, ?, ?, ?)",
        ["admin@earnstack.ca", hash, "Admin", "admin", 1]
      );
    });
  }

  const taskCount = (db.query("SELECT COUNT(*) as c FROM tasks").get() as { c: number }).c;
  if (taskCount === 0) {
    const tasks = [
      ["Test a new mobile app", "Download and test our Canadian weather app. Complete a 5-step onboarding flow and report any bugs.", "app_test", 15, 3.50, 10, "active"],
      ["Complete a short survey", "Answer 20 questions about your grocery shopping habits in Canada. Takes about 10 minutes.", "survey", 10, 2.00, 50, "active"],
      ["Watch and review a promo video", "Watch a 2-minute product demo and write 3 sentences of honest feedback.", "promo_action", 5, 1.25, 30, "active"],
      ["Website usability test", "Navigate our e-commerce site and try to find 3 specific products. Record your screen if possible.", "app_test", 12, 3.00, 20, "active"],
      ["Market research survey", "Canadian tech adoption survey — 15 questions, multiple choice. Anonymous.", "survey", 8, 1.75, 100, "active"],
    ];
    const stmt = db.prepare(
      "INSERT INTO tasks (sponsor_id, title, description, task_type, effort_minutes, payout_cad, max_completions, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    for (const t of tasks) {
      stmt.run(1, t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
    }
  }
}
