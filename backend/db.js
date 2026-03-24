import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'buildmybody.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Core tables ───────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    google_id TEXT UNIQUE,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'client',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sets_data TEXT,
    duration_minutes INTEGER,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS measurements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    weight_lbs REAL,
    body_fat_pct REAL,
    chest_in REAL,
    waist_in REAL,
    hips_in REAL,
    bicep_in REAL,
    thigh_in REAL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ── Migrations (safe for existing databases) ──────────────────────────────────

function addColumnIfMissing(table, column, def) {
  const cols = db.pragma(`table_info(${table})`).map((c) => c.name);
  if (!cols.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
  }
}

// Users: add role column
addColumnIfMissing('users', 'role', "TEXT NOT NULL DEFAULT 'client'");

// Workouts: add user_id (nullable so old rows aren't broken)
addColumnIfMissing('workouts', 'user_id', 'INTEGER REFERENCES users(id) ON DELETE CASCADE');

// Exercises: add sets_data, remove old scalar columns gracefully
addColumnIfMissing('exercises', 'sets_data', 'TEXT');
addColumnIfMissing('exercises', 'duration_minutes', 'INTEGER');
addColumnIfMissing('exercises', 'notes', 'TEXT');

export default db;
