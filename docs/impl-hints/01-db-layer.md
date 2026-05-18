# Hilfestellung: DB-Layer

## Ziel

SQLite-Datenbank mit `better-sqlite3` initialisieren und eine saubere Repository-Schicht bauen.

## Paket

```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

## Was `database.ts` leisten soll

- Verbindung zur SQLite-Datei herstellen (Pfad aus `config.ts`)
- Tabelle `tasks` anlegen, falls sie noch nicht existiert
- Die initialisierte DB-Instanz exportieren

**Task-Schema (Mindestfelder):**

| Spalte | Typ | Hinweis |
|---|---|---|
| `id` | TEXT PRIMARY KEY | UUID |
| `title` | TEXT NOT NULL | |
| `description` | TEXT | nullable |
| `completed` | INTEGER | 0 oder 1 (SQLite kennt kein BOOLEAN) |
| `createdAt` | TEXT | ISO-8601-String |

## Was `tasks.repo.ts` leisten soll

Vier Funktionen — eine pro Operation:

- `getAllTasks()` → alle Tasks als Array
- `createTask(data)` → neuen Task einfügen, zurückgeben
- `updateTask(id, data)` → `completed` oder `title` ändern
- `deleteTask(id)` → Task entfernen

**Wichtig:** `better-sqlite3` ist **synchron** — kein `async/await` nötig.

## Häufige Stolperfallen

- SQLite speichert BOOLEAN als `0`/`1` — beim Lesen mit `!!row.completed` in `boolean` umwandeln
- DB-Datei-Pfad relativ zum Ausführungsverzeichnis setzen, nicht relativ zur Quelldatei
- `db.prepare(...).run(...)` für Schreiboperationen, `.all()` / `.get()` für Lesevorgänge
