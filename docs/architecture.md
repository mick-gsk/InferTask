# Architektur — InferTask

## Überblick

InferTask ist eine lokale Webanwendung. Alle Komponenten laufen auf dem eigenen Gerät — kein Cloud-Backend, keine externe API.

## Schichten

```
┌────────────────────────────┐
│      Frontend (TS)         │
│  Eingabe · Ansichten · UX  │
└────────────┬───────────────┘
             │ REST
┌────────────▼───────────────┐
│      Backend (Node.js)     │
│  Intent-Router · Tool-Layer│
└────────────┬───────────────┘
             │
    ┌─────────┴─────────┐
    │                   │
┌───▼──────┐     ┌──────▼──────────┐
│  SQLite  │     │     Ollama      │
│  Tasks   │     │  LLM lokal      │
│  Memory  │     │  Structured Out │
└──────────┘     └─────────────────┘
```

## LLM-Pipeline

1. **Preprocessing** — Eingabe bereinigen, Kontext aus Memory laden
2. **Intent Classification** — Was will der Nutzer? (Task / Plan / Suche / Tool)
3. **Structured Generation** — JSON-Ausgabe via Ollama Format-Option
4. **Post-processing** — Validierung, Speicherung, UI-Update

## Datenfluss — Beispiel Intent Compiler

```
Eingabe: "Morgen 14 Uhr Zahnarzt anrufen, dringend"
    ↓
Backend: Intent-Router
    ↓
Ollama: Structured Output
  → { title, deadline, priority, category }
    ↓
Validierung + SQLite speichern
    ↓
Frontend: Task erscheint in "Heute"
```

## Designprinzipien

1. **Offline-First** — Kein Internet erforderlich
2. **Privacy-by-Default** — Alle Daten lokal
3. **Structured over Free-Form** — LLM gibt immer JSON zurück
4. **Minimal UI, maximale KI-Tiefe** — Schlichte Oberfläche, komplexe Pipeline dahinter
