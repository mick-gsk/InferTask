# InferTask

> **Infer**enz trifft **Task** Management — eine lokale To-Do App mit integriertem LLM.

InferTask nutzt ein lokal laufendes LLM (via Ollama), um aus freiem Text strukturierte Aufgaben zu erzeugen, Ziele in Pläne zu zerlegen und den nächsten sinnvollen Schritt zu ermitteln. Keine Cloud, keine API-Kosten, volle Datenkontrolle.

🌐 **Live-Demo (Phase 1):** [mick-gsk.github.io/InferTask](https://mick-gsk.github.io/InferTask/)

---

## Stack

| Bereich | Technologie |
|---|---|
| Frontend | TypeScript + HTML + CSS |
| Backend | Node.js |
| Datenbank | SQLite (lokal) |
| LLM Runtime | Ollama |
| Structured Output | JSON Schema via Ollama |

---

## Projektstruktur

```
InferTask/
├── frontend/          # TypeScript UI
│   ├── index.html
│   ├── style.css
│   └── src/
│       └── main.ts
├── backend/           # Node.js API + LLM-Pipeline
│   └── src/
│       ├── server.ts
│       ├── routes/
│       ├── llm/
│       └── db/
├── docs/              # Spezifikation und Architektur
│   ├── features.md
│   ├── architecture.md
│   └── roadmap.md
├── .gitignore
└── README.md
```

---

## Features (geplant)

### MVP
- [ ] Aufgaben anlegen, bearbeiten, abhaken, löschen
- [ ] Freitexteingabe → strukturierter Task via LLM (Intent Compiler)
- [ ] Ziel eingeben → Plan mit Subtasks (Goal-to-Execution)
- [ ] Priorisierung: LLM entscheidet nächsten Schritt (Decision Compression)

### Erweitert
- [ ] Constraint Negotiator: Überlastung und Zielkonflikte erkennen
- [ ] Autonomous Follow-up: blockierte Tasks → automatische nächste Aktion
- [ ] Task Simulation: Plan auf Realisierbarkeit prüfen
- [ ] Lokale semantische Suche

### Memory
- [ ] Persistenter Nutzerkontext über Sessions hinweg
- [ ] Mustererkennung: Blockaden, Zeitbudgets, Präferenzen

---

## Leitprinzip

> Jede LLM-Funktion muss mindestens einen manuellen Schritt vollständig ersetzen — nicht nur unterstützen.

---

## Status

🟡 Phase 1 — Basis CRUD in Arbeit

---

## Lizenz

MIT
