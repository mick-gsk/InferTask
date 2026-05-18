# Hilfestellung: Frontend → API-Migration

## Ziel

`app.js` von LocalStorage auf echte API-Calls umstellen.

## Was sich ändert

| Aktuell | Ziel |
|---|---|
| `tasks`-Array im Speicher | Tasks kommen vom Backend |
| `saveTasks()` → localStorage | `fetch('/api/tasks', ...)` |
| `loadTasks()` → localStorage | `GET /api/tasks` beim Seitenstart |
| Task-ID via `crypto.randomUUID()` | ID kommt vom Backend |

## Fetch-Muster

**Alle Tasks laden (beim Start):**
```
GET /api/tasks
Response: Task[]
```

**Task erstellen:**
```
POST /api/tasks
Body: { title, description }
Response: Task
```

**Task abhaken:**
```
PATCH /api/tasks/:id
Body: { completed: true }
```

**Task löschen:**
```
DELETE /api/tasks/:id
```

## Hinweise

- `async/await` statt `.then()` — lesbarer, weniger Callback-Verschachtelung
- Lokales `tasks`-Array beibehalten als Zustandsspiegel — nach jedem API-Call aktualisieren
- CORS: Backend muss `Access-Control-Allow-Origin` setzen, falls Frontend und Backend auf verschiedenen Ports laufen (`npm install cors`)
- `response.ok` prüfen vor `response.json()` — bei Fehlern aussagekräftige Meldung ausgeben

## Reihenfolge der Migration

1. Erst `loadTasks()` umbauen (nur lesend, kein Risiko)
2. Dann `addTask()` → POST
3. Dann Delete
4. Zuletzt Complete → PATCH
