import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// In production, set DB_PATH=/data/buildmybody.db via a Railway Volume mounted at /data.
// Locally, falls back to the project directory so dev works without any extra setup.
const DB_PATH = process.env.DB_PATH || join(__dirname, 'buildmybody.db');

// Ensure the parent directory exists (matters on first deploy with a fresh volume)
mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// WAL mode allows concurrent reads alongside writes — important for a web server.
// foreign_keys enforces referential integrity (CASCADE deletes, etc.).
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Core tables ───────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT    UNIQUE NOT NULL,
    password_hash TEXT,
    google_id     TEXT    UNIQUE,
    name          TEXT,
    role          TEXT    NOT NULL DEFAULT 'client',
    created_at    TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS workouts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       TEXT    NOT NULL,
    date       TEXT    NOT NULL,
    notes      TEXT,
    created_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id       INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    name             TEXT    NOT NULL,
    sets_data        TEXT,           -- JSON array of { reps, weight }
    duration_minutes INTEGER,
    notes            TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content     TEXT    NOT NULL,
    read        INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS measurements (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date         TEXT    NOT NULL,
    weight_lbs   REAL,
    body_fat_pct REAL,
    chest_in     REAL,
    waist_in     REAL,
    hips_in      REAL,
    bicep_in     REAL,
    thigh_in     REAL,
    notes        TEXT,
    created_at   TEXT    DEFAULT (datetime('now'))
  );
`);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Every frequently-queried foreign key gets an index so lookups stay O(log n)
// instead of doing a full table scan as the dataset grows.

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_workouts_user_id      ON workouts(user_id);
  CREATE INDEX IF NOT EXISTS idx_workouts_date         ON workouts(date);
  CREATE INDEX IF NOT EXISTS idx_exercises_workout_id  ON exercises(workout_id);
  CREATE INDEX IF NOT EXISTS idx_messages_receiver_id  ON messages(receiver_id, read);
  CREATE INDEX IF NOT EXISTS idx_messages_thread       ON messages(sender_id, receiver_id);
  CREATE INDEX IF NOT EXISTS idx_messages_created_at   ON messages(created_at);
`);

// ── Migrations (safe for existing databases) ──────────────────────────────────
// addColumnIfMissing checks the current schema before ALTER TABLE so it's
// idempotent — safe to run on every startup against an existing database.

function addColumnIfMissing(table, column, def) {
  const cols = db.pragma(`table_info(${table})`).map((c) => c.name);
  if (!cols.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
  }
}

// Users: add role column (pre-role databases)
addColumnIfMissing('users', 'role', "TEXT NOT NULL DEFAULT 'client'");

// Workouts: add user_id (nullable so old rows aren't broken by the constraint)
addColumnIfMissing('workouts', 'user_id', 'INTEGER REFERENCES users(id) ON DELETE CASCADE');

// Exercises: add sets_data + ancillary columns (replaced old scalar reps/weight columns)
addColumnIfMissing('exercises', 'sets_data',        'TEXT');
addColumnIfMissing('exercises', 'duration_minutes', 'INTEGER');
addColumnIfMissing('exercises', 'notes',            'TEXT');

export default db;
