# InferTask — Arbeitsgrundlage für alle KI-Assistenten

**Diese Datei ist bindend für alle Copilot-Agenten, Coding-Agenten und KI-Assistenten im InferTask-Workspace.**

---

## Projekt

InferTask ist eine lokale, offline-first To-Do-App mit integriertem lokalem LLM (Ollama).

- **Stack:** TypeScript + HTML/CSS (Frontend), Node.js (Backend), SQLite (Datenbank), Ollama (LLM-Runtime)
- **Prinzip:** Offline-First, Privacy-by-Default, Structured Output statt Freitext
- **Entwickler:** Solo — Mick Gottschalk, Lernprojekt für TypeScript und LLM-Integration

---

## Projektstruktur

```
InferTask/
├── frontend/          # TypeScript UI (index.html, style.css, src/main.ts)
├── backend/           # Node.js API + LLM-Pipeline (ab Phase 2)
├── docs/              # features.md, architecture.md, roadmap.md
├── .github/           # Templates, Instructions, Copilot-Config
```

---

## Aktueller Stand

Phase 1 — Basis CRUD (Frontend only, kein Backend, kein LLM)
- Dateien: `frontend/index.html`, `frontend/style.css`, `frontend/src/main.ts`
- Offene Issues: #9 bis #16

---

## Verbindliche Arbeitsregeln

### Allgemein
1. **Scope respektieren.** Nur ändern was das aktuelle Issue explizit fordert. Kein ungefragtes Refactoring.
2. **Kein Copy-Paste-Code.** Der Entwickler lernt — Code muss erklärt und angepasst werden, nicht blind eingefügt.
3. **Kein `any` in TypeScript** ohne explizite Begründung im Kommentar.
4. **Keine externen Bibliotheken** ohne explizite Freigabe im Issue (kein jQuery, kein Bootstrap, kein Lodash).
5. **Keine Cloud-APIs, keine externen Dienste.** Alles läuft lokal.

### Dateikonventionen
- Frontend-TypeScript: `frontend/src/*.ts`
- Styles: `frontend/style.css`
- HTML: `frontend/index.html`
- IDs und Klassen im HTML **nicht umbenennen** ohne Änderung in `main.ts`
- Alle `id`-Attribute bleiben in kebab-case: `task-list`, `add-btn`, `task-input`

### Commit-Messages
Format: `<typ>: <kurze Beschreibung>`

| Typ | Wann |
|---|---|
| `feat:` | Neue Funktion |
| `fix:` | Bugfix |
| `style:` | Nur CSS-Änderungen |
| `chore:` | Infrastruktur, Konfiguration |
| `docs:` | Nur Dokumentation |

Beispiel: `feat: Phase 1 complete — Basis CRUD mit localStorage`

### Sprache
- Code und Kommentare: **Englisch**
- Commit-Messages: **Englisch**
- Issues, Docs, README: **Deutsch**

---

## Phasen

| Phase | Inhalt | Status |
|---|---|---|
| 1 | Basis CRUD — HTML/CSS/TS + localStorage | 🟡 In Arbeit |
| 2 | Backend (Node.js) + Ollama-Anbindung | ⏳ Geplant |
| 3 | Intent Compiler — Freitext → Task via LLM | ⏳ Geplant |
| 4 | Goal-to-Execution + Decision Compression | ⏳ Geplant |
| 5 | Agentische Funktionen | ⏳ Geplant |
| 6 | Memory + Semantische Suche | ⏳ Geplant |

Details: `docs/roadmap.md`

---

## Designprinzipien

1. **Offline-First** — Kein Internet erforderlich
2. **Privacy-by-Default** — Alle Daten lokal
3. **Structured over Free-Form** — LLM gibt immer JSON zurück, kein Freitext für Kernfunktionen
4. **Minimal UI, maximale KI-Tiefe** — Schlichte Oberfläche, komplexe Pipeline im Hintergrund
5. **Jede LLM-Funktion ersetzt mindestens einen manuellen Schritt vollständig**

---

## Non-Goals (für alle Phasen)

- Kein Cloud-Sync
- Keine sozialen Features
- Keine mobilen Apps
- Keine externen KI-APIs (kein OpenAI, kein Anthropic)
- Kein Dark Mode (noch nicht)
