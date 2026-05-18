# Hilfestellung: REST-Routen

## Ziel

`backend/src/routes/tasks.ts` um die fehlenden Endpunkte erweitern.

## Benötigte Endpunkte

| Method | Pfad | Aufgabe |
|---|---|---|
| `GET` | `/api/tasks` | Alle Tasks laden |
| `POST` | `/api/tasks` | Neuen Task anlegen |
| `PATCH` | `/api/tasks/:id` | Task aktualisieren (completed, title) |
| `DELETE` | `/api/tasks/:id` | Task löschen |
| `POST` | `/api/tasks/infer` | Freitext → Task via LLM |

## Hinweise

- Reihenfolge beachten: `/infer` **vor** `/:id` registrieren, sonst matcht Express `infer` als `:id`
- `PATCH` nur die Felder aktualisieren, die im Body mitgeschickt werden (partial update)
- HTTP-Statuscodes sauber setzen: `201` für CREATE, `200` für UPDATE/GET, `204` für DELETE, `404` wenn Task nicht gefunden
- Validierung: Existiert der Task mit der gegebenen ID überhaupt? Sonst `404` zurückgeben

## Fehlerbehandlung

Zentrales Error-Handling in `server.ts` als letzte Middleware hinzufügen:

```
app.use((err, req, res, next) => { ... })
```

Funktionssignatur mit 4 Parametern — Express erkennt Error-Handler daran.
