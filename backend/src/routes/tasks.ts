import express, { Request, Response } from "express";
import { Task } from "../types.js";
import db from "../db.js";

const router = express.Router();

/** Hilfsfunktion: SQLite-Row in Task-Objekt konvertieren (completed als boolean) */
function rowToTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    completed: row.completed === 1,
    createdAt: row.createdAt as string,
  };
}

router.get("/", function (_req: Request, res: Response) {
  const rows = db.prepare("SELECT * FROM tasks ORDER BY createdAt ASC").all() as Record<string, unknown>[];
  res.json(rows.map(rowToTask));
});

router.post("/", function (req: Request, res: Response) {
  const { title, description } = req.body as {
    title: unknown;
    description: unknown;
  };
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title required" });
  }
  const task: Task = {
    id: crypto.randomUUID(),
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : "",
    completed: false,
    createdAt: new Date().toISOString(),
  };
  db.prepare(
    "INSERT INTO tasks (id, title, description, completed, createdAt) VALUES (?, ?, ?, ?, ?)",
  ).run(task.id, task.title, task.description, 0, task.createdAt);
  res.status(201).json(task);
});

router.patch("/:id", function (req: Request, res: Response) {
  const result = db
    .prepare("UPDATE tasks SET completed = 1 WHERE id = ?")
    .run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id) as Record<string, unknown>;
  res.json(rowToTask(row));
});

router.delete("/:id", function (req: Request, res: Response) {
  const result = db
    .prepare("DELETE FROM tasks WHERE id = ?")
    .run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

export default router;
