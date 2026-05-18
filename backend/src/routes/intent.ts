import express, { Request, Response } from "express";
import db from "../db.js";
import { askOllamaStructured } from "../llm/ollama.js";
import { buildIntentCompilerPrompt } from "../llm/prompts/intent-compiler.js";
import taskSchema from "../llm/schemas/task.schema.json" assert { type: "json" };
import { Task } from "../types.js";

const router = express.Router();

/**
 * POST /api/intent
 * Nimmt deutschen Freitext entgegen, lässt das LLM einen strukturierten
 * Task daraus ableiten und speichert ihn in der Datenbank.
 *
 * Body: { text: string }
 * Response 201: Task-Objekt
 * Response 400: fehlender/leerer text
 * Response 503: Ollama nicht erreichbar
 */
router.post("/", async function (req: Request, res: Response) {
  const { text } = req.body as { text: unknown };
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "text erforderlich" });
  }

  const raw = await askOllamaStructured(
    buildIntentCompilerPrompt(),
    text.trim(),
    taskSchema as Record<string, unknown>,
  );

  if (raw === null) {
    return res
      .status(503)
      .json({ error: "LLM nicht verfügbar – läuft Ollama?" });
  }

  const task: Task = {
    id: crypto.randomUUID(),
    title: String(raw.title ?? "").trim(),
    description: "",
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: typeof raw.deadline === "string" ? raw.deadline : null,
    priority: (["low", "medium", "high"].includes(raw.priority as string)
      ? raw.priority
      : "medium") as Task["priority"],
    category: typeof raw.category === "string" ? raw.category : "",
  };

  db.prepare(
    `INSERT INTO tasks (id, title, description, completed, deadline, priority, category, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    task.id,
    task.title,
    task.description,
    0,
    task.deadline ?? null,
    task.priority,
    task.category,
    task.createdAt,
  );

  res.status(201).json(task);
});

export default router;
