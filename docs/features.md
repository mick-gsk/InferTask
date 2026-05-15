# Feature-Spezifikation — InferTask

Jedes Feature wird bewertet nach:
- **Zeitersparnis**: Ersetzt es einen echten manuellen Schritt vollständig?
- **LLM-Tiefe**: Nutzt es wirklich LLM-Fähigkeiten (Verstehen, Planen, Tool Use, Memory)?
- **Buildbarkeit**: Wie komplex ist die Umsetzung als Solo-Entwickler?

---

## Tier 1 — MVP

### 1. Basis-CRUD
Aufgaben anlegen, bearbeiten, als erledigt markieren, löschen.
- Felder: Titel, Beschreibung, Fälligkeit, Priorität, Kategorie, Erledigt
- Kein LLM — reine App-Logik
- Buildbarkeit: ⭐ einfach

### 2. Intent Compiler
Freitext → strukturierter Task (JSON) via LLM.
- Beispiel: "Morgen 14 Uhr Zahnarzt anrufen, dringend" → { title, deadline, priority, category }
- Technologie: Ollama Structured Output + JSON Schema
- Zeitersparnis: ersetzt manuelles Formular-Ausfüllen
- Buildbarkeit: ⭐⭐ mittel

### 3. Goal-to-Execution
Unscharfes Ziel → Plan mit Subtasks, Reihenfolge, Zeitschätzung.
- Beispiel: "Bewerbung vorbereiten" → 5 konkrete Tasks mit Abhängigkeiten
- Technologie: Chain-of-Thought + Structured Output
- Zeitersparnis: ersetzt manuelles Task-Design vollständig
- Buildbarkeit: ⭐⭐ mittel

### 4. Decision Compression
Alle offenen Tasks → 1–3 nächste sinnvolle Schritte.
- Das LLM bewertet Deadline, Aufwand, Abhängigkeiten und Kontext
- Zeitersparnis: ersetzt tägliche Prioritätssichtung
- Buildbarkeit: ⭐⭐ mittel

---

## Tier 2 — Agentische Schicht

### 5. Constraint Negotiator
Tagesplan + Zeitbudget → Konflikte und Alternativvorschläge.
- Verhindert Overplanning bevor es passiert
- Buildbarkeit: ⭐⭐⭐ komplex

### 6. Autonomous Follow-up Engine
Blockierte/überfällige Tasks → automatische Rückfrage oder nächste Aktion.
- Läuft als Hintergrundprozess
- Buildbarkeit: ⭐⭐⭐ komplex

### 7. Task Simulation
Plan → Realisierbarkeits-Check mit Risiken und fehlenden Abhängigkeiten.
- Buildbarkeit: ⭐⭐⭐ komplex

### 8. Local Research-to-Task
Lokale Dokumente/Notizen → Handlungsbedarf extrahieren → Tasks erzeugen.
- Buildbarkeit: ⭐⭐⭐ komplex

---

## Tier 3 — Memory

### 9. Persistentes Memory
Präferenzen, Zeitbudgets, Projekte über Sessions hinweg speichern.

### 10. Mustererkennung
Wiederkehrende Blockaden und Arbeitsmuster personalisieren Vorschläge.

### 11. Semantische Suche
Natürlichsprachliche Abfragen über alle Tasks und Notizen.
