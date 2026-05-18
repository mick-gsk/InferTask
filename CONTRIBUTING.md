# Contributing — InferTask

InferTask ist ein persönliches Open-Source-Projekt. Beiträge sind willkommen, solange sie im Rahmen der Projektziele bleiben.

---

## Voraussetzungen

- Node.js >= 20
- [Ollama](https://ollama.com) installiert (für LLM-Features)
- `npm install` im Root ausgeführt

---

## Workflow

### 1. Issue zuerst

Vor jeder nicht-trivialen Änderung ein Issue anlegen:
- **Bug:** `.github/ISSUE_TEMPLATE/bug.yml`
- **Feature:** `.github/ISSUE_TEMPLATE/feature_request.yml`

Kleinere Fixes (Tippfehler, Doku) können direkt als PR kommen.

### 2. Branch-Konvention

```
feat/<kurzbeschreibung>      # neue Funktion
fix/<kurzbeschreibung>       # Bugfix
chore/<kurzbeschreibung>     # Infrastruktur, Konfiguration
docs/<kurzbeschreibung>      # nur Dokumentation
```

### 3. Commit-Konvention (Conventional Commits)

```
feat: Freitexteingabe → LLM Intent Compiler
fix: leere Title-Validierung im Modal
chore: ESLint-Regel für no-any verschärft
docs: Setup-Anleitung in DEVELOPER.md ergänzt
```

Kein Scope erforderlich. Kein Ausrufezeichen für Breaking Changes im MVP.

### 4. Code-Qualität

Vor jedem Commit lokal ausführen:

```bash
npm run typecheck    # TypeScript-Fehler
npm run lint         # ESLint
npm run format:check # Prettier
```

Oder alles auf einmal:

```bash
npm run check
```

Der CI-Workflow prüft dieselben Schritte automatisch beim Push.

### 5. Pull Request

- PR-Titel folgt Conventional-Commits-Format
- PR-Body füllt das Template vollständig aus
- Ein PR = ein Issue = ein klar abgegrenzter Scope
- Keine ungefragten Refactorings außerhalb des Issue-Scopes

---

## Code-Stil

| Regel | Wert |
|---|---|
| Formatter | Prettier (Konfiguration in `prettier.config.json`) |
| Linter | ESLint (Konfiguration in `eslint.config.js`) |
| TypeScript | Strict-Modus (`tsconfig.json`) |
| Kein `any` | Nur mit begründetem Kommentar erlaubt |
| Imports | Explizite `.js`-Erweiterungen bei ESM |

---

## Verzeichnis-Regeln

- **`backend/src/routes/`** — nur Express-Router, keine Business-Logik
- **`backend/src/db/`** — nur Datenbankzugriff, kein HTTP-Kontext
- **`backend/src/llm/`** — nur Ollama-Kommunikation, keine Route-Logik
- **`frontend/src/`** — UI-Logik, kein direkter DB-Zugriff

---

## Sicherheit

Keine API-Keys, Tokens oder Credentials committen. `.env`-Dateien sind in `.gitignore` erfasst. Security-Issues **nicht** als öffentliches Issue melden — direkt per E-Mail.
