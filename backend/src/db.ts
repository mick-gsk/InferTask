import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DB_PATH ?? path.resolve("./infertask.db");

/**
 * Initialisiert die SQLite-Datenbankverbindung.
 * Die Datei wird beim ersten Start automatisch angelegt.
 * Tabellen werden per CREATE TABLE IF NOT EXISTS erstellt.
 */
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    completed  INTEGER NOT NULL DEFAULT 0,
    createdAt  TEXT NOT NULL
  );
`);

export default db;
