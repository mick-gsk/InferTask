import express, { Request, Response } from "express";
import { Task } from "../types.js";
import db from "../db.js";

const router = express.Router();

interface Subtask {
  id: string;
  taskId: string;
  title: string;
  ord: number;
  completed: boolean;
}

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

function rowToSubtask(row: Record<string, unknown>): Subtask {
  return {
    id: row.id as string,
    taskId: row.taskId as string,
    title: row.title as string,
    ord: row.ord as number,
    completed: row.completed === 1,
  };
}

router.get("/", function (_req: Request, res: Response) {
  const rows = db.prepare("SELECT * FROM tasks ORDER BY createdAt ASC").all() as Record<string, unknown>[];
  res.json(rows.map(rowToTask));
});

router.get("/:id/subtasks", function (req: Request, res: Response) {
  const taskRow = db.prepare("SELECT id FROM tasks WHERE id = ?").get(req.params.id) as Record<string, unknown> | undefined;
  if (!taskRow) return res.status(404).json({ error: "Not found" });

  const rows = db
    .prepare("SELECT id, taskId, title, ord, completed FROM subtasks WHERE taskId = ? ORDER BY ord ASC")
    .all(req.params.id) as Record<string, unknown>[];

  res.json(rows.map(rowToSubtask));
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

router.patch("/:taskId/subtasks/:subtaskId", function (req: Request, res: Response) {
  const taskId = req.params.taskId;
  const subtaskId = req.params.subtaskId;

  const subtaskRow = db
    .prepare("SELECT * FROM subtasks WHERE id = ? AND taskId = ?")
    .get(subtaskId, taskId) as Record<string, unknown> | undefined;

  if (!subtaskRow) return res.status(404).json({ error: "Not found" });

  db.prepare("UPDATE subtasks SET completed = 1 WHERE id = ? AND taskId = ?").run(subtaskId, taskId);

  const remainingOpen = db
    .prepare("SELECT COUNT(*) as count FROM subtasks WHERE taskId = ? AND completed = 0")
    .get(taskId) as { count: number };

  if (remainingOpen.count === 0) {
    db.prepare("UPDATE tasks SET completed = 1 WHERE id = ?").run(taskId);
  }

  const updatedRow = db
    .prepare("SELECT * FROM subtasks WHERE id = ? AND taskId = ?")
    .get(subtaskId, taskId) as Record<string, unknown>;

  res.json(rowToSubtask(updatedRow));
});

router.delete("/:id", function (req: Request, res: Response) {
  const result = db
    .prepare("DELETE FROM tasks WHERE id = ?")
    .run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

export default router;
