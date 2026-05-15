# Developer Guide — InferTask

Dieses Dokument beschreibt den lokalen Entwicklungs-Workflow, die Ordnerstruktur und alle nötigen Befehle.

---

## Voraussetzungen

| Tool | Version | Zweck |
|---|---|---|
| Node.js | ≥18 | Backend (ab Phase 2) |
| TypeScript | ≥5 | Frontend |
| Ollama | aktuell | LLM-Runtime (ab Phase 2) |
| Git | aktuell | Versionskontrolle |
| VS Code | aktuell | Editor |

Phase 1 braucht **kein Build-Tool** — `main.ts` wird direkt als `main.js` referenziert (TypeScript-Compiler erst ab Phase 2 notwendig).

---

## Projekt lokal starten (Phase 1)

```bash
# Repo klonen
git clone https://github.com/mick-gsk/InferTask.git
cd InferTask

# App öffnen
# frontend/index.html direkt im Browser öffnen (Doppelklick)
```

Kein `npm install`, kein Build-Schritt in Phase 1.

---

## Projektstruktur

```
InferTask/
├── frontend/
│   ├── index.html         # HTML-Grundstruktur
│   ├── style.css          # Alle Styles
│   └── src/
│       └── main.ts         # Gesamte Frontend-Logik (Phase 1)
├── backend/               # Ab Phase 2
│   └── src/
│       ├── server.ts
│       ├── routes/
│       ├── llm/
│       └── db/
├── docs/
│   ├── features.md
│   ├── architecture.md
│   └── roadmap.md
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── copilot-instructions.md
├── .gitignore
├── DEVELOPER.md
├── CONTRIBUTING.md
└── README.md
```

---

## Git-Workflow

```bash
# Status prüfen
git status

# Änderungen ansehen
git diff

# Stagen und committen
git add .
git commit -m "feat: Phase 1 complete — Basis CRUD mit localStorage"

# Pushen
git push
```

### Commit-Typen

| Typ | Wann |
|---|---|
| `feat:` | Neue Funktion |
| `fix:` | Bugfix |
| `style:` | Nur CSS |
| `chore:` | Konfiguration, Infrastruktur |
| `docs:` | Dokumentation |

---

## Debugging im Browser

| Aktion | Shortcut |
|---|---|
| Konsole öffnen | F12 → Console |
| DOM inspizieren | F12 → Elements |
| localStorage ansehen | F12 → Application → Local Storage |
| localStorage leeren | F12 → Application → Local Storage → Rechtsklick → Clear |
| Seite neu laden | F5 oder Strg+R |
| Hard Reload (Cache leeren) | Strg+Shift+R |

---

## Issues abarbeiten

1. Issue auf GitHub öffnen und vollständig lesen
2. **Scope** prüfen — nur die genannten Dateien ändern
3. Implementieren — kein Copy-Paste, eigenen Code schreiben
4. **Verifikation** aus dem Issue Schritt für Schritt durchgehen
5. Alle **Acceptance Criteria** abhaken
6. Issue auf GitHub schließen
7. Nächstes Issue öffnen

---

## Phasen-Übersicht

Details in `docs/roadmap.md`.

| Phase | Startet wenn ... |
|---|---|
| Phase 2 | Alle Issues #9–#16 geschlossen und gepusht |
| Phase 3 | Backend läuft lokal, Ollama antwortet |
| Phase 4 | Intent Compiler funktioniert stabil |
