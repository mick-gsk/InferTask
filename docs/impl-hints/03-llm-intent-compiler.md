# Hilfestellung: Intent Compiler (LLM-Pipeline)

## Ziel

Freitext vom Nutzer → strukturierter Task (JSON) via Ollama.

## Funktionssignatur

```ts
async function compileIntent(userInput: string): Promise<{
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  deadline?: string; // ISO-8601 oder null
}>
```

## Strategie: Structured Output via Ollama

Ollama unterstützt das `format`-Feld im API-Body:

```json
{
  "model": "...",
  "prompt": "...",
  "format": "json",
  "stream": false
}
```

Damit gibt das Modell garantiert gültiges JSON zurück — kein Regex-Parsing nötig.

## Prompt-Aufbau

Empfehlung: System-Prompt und User-Input sauber trennen.

**System-Prompt (Kern):**
- Rolle definieren: „Du bist ein Task-Parser"
- Ausgabe-Schema explizit beschreiben (Felder, Typen, erlaubte Werte)
- Kein Fülltext, nur das JSON-Objekt

**Beispiel-Struktur:**
```
Extrahiere aus dem folgenden Text eine strukturierte Aufgabe.
Antworte ausschließlich mit einem JSON-Objekt mit den Feldern:
title (string), description (string), priority ("low"|"medium"|"high"), deadline (ISO-8601 oder null)

Eingabe: {userInput}
```

## Validierung nach dem LLM-Call

- `JSON.parse()` in `try/catch` — Modell kann trotz `format:json` fehlerhaften Output liefern
- Pflichtfelder prüfen: `title` muss vorhanden und nicht leer sein
- Fallback: Bei Parse-Fehler den `userInput` direkt als `title` nutzen

## Integration in Route

`POST /api/tasks/infer` — Ablauf:
1. `userInput` aus Body lesen
2. `compileIntent(userInput)` aufrufen
3. Ergebnis mit `createTask()` in DB speichern
4. Gespeicherten Task zurückgeben
