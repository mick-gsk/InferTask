import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DB_PATH ?? path.resolve("./infertask.db");

/**
 * Initialisiert die SQLite-Datenbankverbindung.
 * Die Datei wird beim ersten Start automatisch angelegt.
 * Alle Tabellen werden per CREATE TABLE IF NOT EXISTS erstellt (idempotent).
 */
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    completed   INTEGER NOT NULL DEFAULT 0,
    deadline    TEXT,
    priority    TEXT NOT NULL DEFAULT 'medium',
    category    TEXT NOT NULL DEFAULT '',
    createdAt   TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subtasks (
    id        TEXT PRIMARY KEY,
    taskId    TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title     TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    ord       INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS memory (
    id        TEXT PRIMARY KEY,
    key       TEXT NOT NULL,
    value     TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`);

export default db;
