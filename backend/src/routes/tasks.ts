import express, { Request, Response } from "express";
import { Task } from "../types.js";

const router = express.Router();

/** Temporärer In-Memory-Store bis zur SQLite-Migration (siehe #51) */
const taskStore: Task[] = [];

router.get("/", function (_req: Request, res: Response) {
  res.json(taskStore);
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
  taskStore.push(task);
  res.status(201).json(task);
});

router.patch("/:id", function (req: Request, res: Response) {
  const task = taskStore.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Not found" });
  task.completed = true;
  res.json(task);
});

router.delete("/:id", function (req: Request, res: Response) {
  const index = taskStore.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  taskStore.splice(index, 1);
  res.status(204).send();
});

export default router;
