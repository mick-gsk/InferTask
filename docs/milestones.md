# Milestones — InferTask

## Milestone 1 — Phase 1: Basis CRUD

**Ziel:** Funktionierende To-Do App im Browser ohne LLM.

**Issues:** #9, #10, #11, #12, #13, #14, #15, #16

**Abgeschlossen wenn:**
- Alle Issues #9–#16 geschlossen
- App unter https://mick-gsk.github.io/InferTask/ erreichbar
- Commit `feat: Phase 1 complete — Basis CRUD mit localStorage` gepusht

---

## Milestone 2 — Phase 2: Backend + Ollama

**Ziel:** Node.js Backend läuft lokal, Ollama antwortet auf strukturierte Anfragen.

**Abgeschlossen wenn:**
- `POST /api/tasks` Endpunkt antwortet
- Ollama gibt JSON zurück auf einfachen Prompt
- SQLite Datenbank mit Tabellen `tasks`, `subtasks`, `memory` existiert

---

## Milestone 3 — Phase 3: Intent Compiler

**Ziel:** Freitexteingabe erzeugt strukturierten Task via LLM.

**Abgeschlossen wenn:**
- Eingabe `"Morgen 14 Uhr Zahnarzt anrufen, dringend"` erzeugt `{ title, deadline, priority, category }`
- Task erscheint automatisch in der Liste
- Fehlerbehandlung bei unvollständiger LLM-Antwort vorhanden
