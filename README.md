<div align="center">

# InferTask

**Stop writing tasks. Start describing intent.**

InferTask nimmt freien Text und verwandelt ihn in strukturierte Aufgaben — lokal, offline, ohne Cloud.

[![Status](https://img.shields.io/badge/status-phase%201%20%E2%80%94%20MVP%20in%20Arbeit-yellow?style=for-the-badge)](#status)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-TypeScript%20%2B%20Node.js%20%2B%20Ollama-informational?style=for-the-badge)](#stack)

🌐 **Live-Demo (Phase 1 — Frontend only):** [mick-gsk.github.io/InferTask](https://mick-gsk.github.io/InferTask/)

</div>

---

InferTask nutzt ein lokal laufendes LLM (via [Ollama](https://ollama.com)), um aus freiem Text strukturierte Aufgaben zu erzeugen, Ziele in Pläne zu zerlegen und den nächsten sinnvollen Schritt zu ermitteln. Keine Cloud, keine API-Kosten, volle Datenkontrolle.

> **Leitprinzip:** Jede LLM-Funktion muss mindestens einen manuellen Schritt vollständig ersetzen — nicht nur unterstützen.

[Developer Guide](DEVELOPER.md) | [Architektur](docs/architecture.md) | [Features](docs/features.md) | [Roadmap](docs/roadmap.md) | [Implementierungs-Hints](docs/impl-hints/) | [Contributing](CONTRIBUTING.md)

---

## Status

InferTask ist in aktiver Entwicklung. Phase 1 (CRUD-Frontend) ist deployed.

| Komponente | Status |
|---|---|
| Frontend CRUD (HTML/CSS/JS) | ✅ Fertig — [Live-Demo](https://mick-gsk.github.io/InferTask/) |
| LocalStorage-Persistenz | ✅ Fertig |
| Backend (Express + Node.js) | 🟡 In Arbeit |
| SQLite DB-Layer | 🔴 Ausstehend |
| REST-Routen (GET/PATCH/DELETE) | 🔴 Ausstehend |
| LLM Intent Compiler (Ollama) | 🔴 Ausstehend |
| Frontend → API-Migration | 🔴 Ausstehend |
| Ziel → Plan (Goal-to-Execution) | 🔴 Geplant |
| Persistenter Nutzerkontext (Memory) | 🔴 Geplant |

---

## Schnellstart

**Voraussetzungen:** Node.js ≥ 20, [Ollama](https://ollama.com) installiert

```bash
# 1. Repo klonen
git clone https://github.com/mick-gsk/InferTask.git
cd InferTask

# 2. Abhängigkeiten installieren
npm install

# 3. Ollama-Modell laden (einmalig)
ollama pull llama3

# 4. Backend starten
npm run dev:backend

# 5. Frontend öffnen
# frontend/src/index.html im Browser öffnen
```

> Backend läuft auf Port `3000`. Frontend kommuniziert nach der API-Migration direkt mit dem Backend.

---

## Stack

| Bereich | Technologie |
|---|---|
| Frontend | TypeScript · HTML · CSS |
| Backend | Node.js · Express |
| Datenbank | SQLite (lokal, via `better-sqlite3`) |
| LLM Runtime | Ollama |
| Structured Output | JSON Schema via Ollama `format: "json"` |

---

## Features

### MVP (Phase 2)
- [ ] Aufgaben anlegen, bearbeiten, abhaken, löschen
- [ ] Freitexteingabe → strukturierter Task via LLM (**Intent Compiler**)
- [ ] Ziel eingeben → Plan mit Subtasks (**Goal-to-Execution**)
- [ ] LLM entscheidet nächsten Schritt (**Decision Compression**)

### Erweitert (Phase 3+)
- [ ] **Constraint Negotiator** — Überlastung und Zielkonflikte erkennen
- [ ] **Autonomous Follow-up** — blockierte Tasks → automatische nächste Aktion
- [ ] **Task Simulation** — Plan auf Realisierbarkeit prüfen
- [ ] Lokale semantische Suche
- [ ] Persistenter Nutzerkontext über Sessions
- [ ] Mustererkennung: Blockaden, Zeitbudgets, Präferenzen

---

## Architektur

```
┌────────────────────────────┐
│      Frontend (TS)          │
│  Eingabe · Ansichten · UX  │
└───────────┬───────────────┘
             │ REST
┌───────────┴───────────────┐
│      Backend (Node.js)     │
│  Routes · Intent-Router    │
└───────────┬───────────────┘
             │
    ┌───────┴───────┐
    │              │
┌───┴─────┐  ┌────┴──────────┐
│  SQLite  │  │    Ollama      │
│  Tasks   │  │  LLM lokal    │
│  Memory  │  │  JSON Output  │
└─────────┘  └──────────────┘
```

**Datenfluss — Beispiel Intent Compiler:**

```
Eingabe: "Morgen 14 Uhr Zahnarzt anrufen, dringend"
    ↓
Backend: Intent-Router
    ↓
Ollama: Structured Output (format: json)
  → { title, deadline, priority, category }
    ↓
Validierung + SQLite speichern
    ↓
Frontend: Task erscheint in der Liste
```

**Designprinzipien:**
- **Offline-First** — kein Internet erforderlich
- **Privacy-by-Default** — alle Daten lokal
- **Structured over Free-Form** — LLM gibt immer JSON zurück

---

## Projektstruktur

```
InferTask/
├── frontend/src/
│   ├── index.html
│   ├── styles.css
│   └── app.js            ← UI-Logik (TODO: auf API umstellen)
├── backend/src/
│   ├── server.ts         ← Express-Einstiegspunkt
│   ├── config.ts
│   ├── routes/tasks.ts   ← REST-Endpunkte
│   ├── db/               ← SQLite-Layer (TODO)
│   └── llm/
│       ├── ollama.ts       ← Basis-Client
│       └── intentCompiler.ts ← Freitext → Task (TODO)
└── docs/
    ├── architecture.md
    ├── features.md
    ├── roadmap.md
    └── impl-hints/       ← Implementierungs-Leitfäden
```

---

## Entwicklung

```bash
git clone https://github.com/mick-gsk/InferTask.git
cd InferTask
npm install
```

Vollständige Setup-Anleitung, Ports und Implementierungs-Reihenfolge: [DEVELOPER.md](DEVELOPER.md)

Hints für jeden Implementierungsschritt: [docs/impl-hints/](docs/impl-hints/)

---

## Lizenz

MIT. Siehe [LICENSE](LICENSE).

---

<div align="center">

Maintained by [Mick Gottschalk](https://github.com/mick-gsk)

</div>
