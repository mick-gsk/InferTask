import express, { Request, Response } from "express";
import db from "../db.js";
import { askOllamaStructured } from "../llm/ollama.js";
import { buildGoalToExecutionPrompt } from "../llm/prompts/goal-to-execution.js";
import subtasksSchema from "../llm/schemas/subtasks.schema.json" assert { type: "json" };

const router = express.Router();

interface SubtaskItem {
  title: string;
  ord: number;
}

function validateSubtasks(raw: Record<string, unknown>): string | null {
  const subtasks = raw["subtasks"];
  if (!Array.isArray(subtasks)) return "subtasks-Array fehlt in LLM-Antwort";
  if (subtasks.length < 1 || subtasks.length > 7)
    return `subtasks muss 1–7 Einträge haben, erhalten: ${subtasks.length}`;
  for (const item of subtasks) {
    if (typeof item !== "object" || item === null)
      return "Subtask-Eintrag ist kein Objekt";
    const { title, ord } = item as Record<string, unknown>;
    if (typeof title !== "string" || title.trim() === "")
      return "Subtask hat keinen gültigen title";
    if (typeof ord !== "number" || !Number.isInteger(ord) || ord < 1)
      return "Subtask hat kein gültiges ord (Integer >= 1)";
  }
  return null;
}

/**
 * POST /api/goals
 * Zerlegt ein Ziel via LLM in Subtasks, legt Eltern-Task + Subtasks in DB an.
 *
 * Body:          { title: string }
 * Response 201:  { task, subtasks }
 * Response 400:  title fehlt oder leer
 * Response 422:  LLM-Antwort ungültig
 * Response 503:  Ollama nicht erreichbar
 */
router.post("/", async function (req: Request, res: Response) {
  const { title } = req.body as { title: unknown };
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title erforderlich" });
  }

  const trimmedTitle = title.trim();
  const prompt = buildGoalToExecutionPrompt();

  const raw = await askOllamaStructured(prompt, trimmedTitle, subtasksSchema as Record<string, unknown>);

  if (raw === null) {
    return res.status(503).json({
      error: "LLM nicht verfügbar oder ungültiges JSON – läuft Ollama?",
    });
  }

  const validationError = validateSubtasks(raw);
  if (validationError !== null) {
    return res.status(422).json({
      error: validationError,
      hint: "Bitte Eingabe klarer formulieren",
    });
  }

  const subtaskItems = (raw["subtasks"] as SubtaskItem[]);
  const isAtomic = subtaskItems.length === 1;

  const taskId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const task = {
    id: taskId,
    title: trimmedTitle,
    description: "",
    completed: false,
    deadline: null as string | null,
    priority: "medium" as const,
    category: "",
    createdAt,
  };

  const insertTask = db.prepare(
    `INSERT INTO tasks (id, title, description, completed, deadline, priority, category, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  const insertSubtask = db.prepare(
    `INSERT INTO subtasks (id, taskId, title, ord, completed)
     VALUES (?, ?, ?, ?, 0)`,
  );

  if (isAtomic) {
    insertTask.run(
      task.id, task.title, task.description, 0,
      task.deadline, task.priority, task.category, task.createdAt,
    );
    return res.status(201).json({ task, subtasks: [] });
  }

  const savedSubtasks: Array<{
    id: string; taskId: string; title: string; ord: number; completed: boolean;
  }> = [];

  const transaction = db.transaction(() => {
    insertTask.run(
      task.id, task.title, task.description, 0,
      task.deadline, task.priority, task.category, task.createdAt,
    );
    for (const item of subtaskItems) {
      const subtaskId = crypto.randomUUID();
      insertSubtask.run(subtaskId, taskId, item.title.trim(), item.ord);
      savedSubtasks.push({
        id: subtaskId,
        taskId,
        title: item.title.trim(),
        ord: item.ord,
        completed: false,
      });
    }
  });

  transaction();

  return res.status(201).json({ task, subtasks: savedSubtasks });
});

export default router;
