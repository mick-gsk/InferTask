import express, { Request, Response } from "express";
import db from "../db.js";
import { askOllamaStructured } from "../llm/ollama.js";
import { buildIntentCompilerPrompt } from "../llm/prompts/intent-compiler.js";
import taskSchema from "../llm/schemas/task.schema.json" assert { type: "json" };
import { Task } from "../types.js";

const router = express.Router();

const VALID_PRIORITIES = ["low", "medium", "high"] as const;

/**
 * Validiert die geparste LLM-Antwort gegen das Task-Schema.
 * Gibt null zurück wenn alles valid ist, sonst eine deutsche Fehlermeldung.
 */
function validateLlmResponse(
  raw: Record<string, unknown>,
): string | null {
  if (!raw.title || typeof raw.title !== "string" || (raw.title as string).trim() === "") {
    return "Feld fehlt: title";
  }
  if (raw.deadline !== null && typeof raw.deadline !== "string") {
    return "Feld fehlt: deadline";
  }
  if (!VALID_PRIORITIES.includes(raw.priority as typeof VALID_PRIORITIES[number])) {
    return `Ungültige Priorität: ${String(raw.priority)}`;
  }
  if (!raw.category || typeof raw.category !== "string" || (raw.category as string).trim() === "") {
    return "Feld fehlt: category";
  }
  return null;
}

/**
 * POST /api/intent
 * Nimmt deutschen Freitext entgegen, lässt das LLM einen strukturierten
 * Task daraus ableiten, validiert die Antwort und speichert den Task.
 *
 * Body:          { text: string }
 * Response 201:  Task-Objekt
 * Response 400:  fehlender/leerer text
 * Response 422:  LLM-Antwort ungültig (Feld fehlt oder falscher Typ)
 * Response 503:  Ollama nicht erreichbar oder ungültiges JSON
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
      .json({ error: "LLM nicht verfügbar oder ungültiges JSON – läuft Ollama?" });
  }

  const validationError = validateLlmResponse(raw);
  if (validationError !== null) {
    return res.status(422).json({ error: validationError });
  }

  const task: Task = {
    id: crypto.randomUUID(),
    title: (raw.title as string).trim(),
    description: "",
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: typeof raw.deadline === "string" ? raw.deadline : null,
    priority: raw.priority as Task["priority"],
    category: (raw.category as string).trim(),
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
