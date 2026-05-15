# Roadmap — InferTask

## Phase 1 — Fundament (MVP ohne LLM)

Ziel: Funktionierende To-Do App, bevor LLM integriert wird.

- [ ] Projektstruktur anlegen (Frontend + Backend trennen)
- [ ] HTML-Grundstruktur: Eingabefeld, Task-Liste, Modal
- [ ] CSS: Layout, Farben, Modal-Styling
- [ ] TypeScript: Tasks anlegen, anzeigen, abhaken, löschen
- [ ] localStorage oder SQLite: Tasks persistent speichern
- [ ] Ansichten: Heute / Inbox / Erledigt

## Phase 2 — Backend + Ollama Anbindung

Ziel: Node.js Backend läuft lokal, Ollama antwortet auf Anfragen.

- [ ] Node.js Server aufsetzen (Express oder Hono)
- [ ] REST-Endpunkt: POST /api/tasks
- [ ] Ollama lokal installieren und Modell laden
- [ ] Ersten Prompt an Ollama senden und JSON-Antwort verarbeiten
- [ ] SQLite Datenbank anlegen (Tabellen: tasks, subtasks, memory)

## Phase 3 — Intent Compiler

Ziel: Freieingabe erzeugt strukturierten Task via LLM.

- [ ] JSON Schema für Task definieren
- [ ] System-Prompt für Intent Compiler schreiben
- [ ] Ollama Structured Output aktivieren
- [ ] Frontend: Freitexteingabe → API-Call → Task erscheint
- [ ] Fehlerbehandlung: Was tun wenn LLM unvollständige Daten zurückgibt?

## Phase 4 — Goal-to-Execution + Decision Compression

- [ ] Goal-to-Execution Prompt + Schema
- [ ] Subtask-Anzeige im Frontend
- [ ] Decision Compression: Tagesansicht mit 1–3 Empfehlungen

## Phase 5 — Agentische Funktionen

- [ ] Constraint Negotiator
- [ ] Autonomous Follow-up Engine
- [ ] Task Simulation

## Phase 6 — Memory + Suche

- [ ] Persistentes Memory (SQLite)
- [ ] Semantische Suche
- [ ] Mustererkennung
