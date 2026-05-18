# Developer Guide — InferTask

## Voraussetzungen

- Node.js >= 20
- [Ollama](https://ollama.com) installiert und laufend
- Ollama-Modell geladen (z.B. `ollama pull llama3`)
- `npm install` im Root ausgeführt

## Starten

```bash
# Backend
npm run dev:backend

# Frontend (separates Terminal)
npm run dev:frontend
```

> Ports: Backend auf `3000`, Frontend direkt über `frontend/src/index.html` oder eigenen Dev-Server

## Projektstruktur

```
InferTask/
├── backend/src/
│   ├── config.ts          ← MODEL_NAME, DB-Pfad
│   ├── server.ts          ← Express-Einstiegspunkt
│   ├── routes/
│   │   └── tasks.ts       ← GET / POST / PATCH / DELETE
│   ├── db/
│   │   ├── database.ts    ← SQLite-Verbindung + Schema-Init  [TODO]
│   │   └── tasks.repo.ts  ← CRUD-Funktionen                  [TODO]
│   └── llm/
│       ├── ollama.ts      ← askOllama() Basisfunktion
│       └── intentCompiler.ts ← Freitext → strukturierter Task [TODO]
└── frontend/src/
    ├── index.html
    ├── styles.css
    └── app.js             ← UI-Logik (→ auf API umstellen)    [TODO]
```

## Implementierungs-Reihenfolge (MVP)

1. `backend/src/db/database.ts` — SQLite initialisieren
2. `backend/src/db/tasks.repo.ts` — CRUD-Funktionen
3. `backend/src/routes/tasks.ts` — alle 4 Endpunkte
4. `backend/src/llm/intentCompiler.ts` — LLM-Pipeline
5. `frontend/src/app.js` — LocalStorage → API-Calls

Details zu jedem Schritt: siehe `docs/impl-hints/`
