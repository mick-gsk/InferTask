import express, { Request, Response } from "express";
import db from "../db.js";
import { askOllamaStructured } from "../llm/ollama.js";
import { buildIntentCompilerPrompt } from "../llm/prompts/intent-compiler.js";
import taskSchema from "../llm/schemas/task.schema.json" assert { type: "json" };
import { Task } from "../types.js";

const router = express.Router();

const VALID_PRIORITIES = ["low", "medium", "high"] as const;
const MAX_TITLE_LENGTH = 120;

/**
 * Validiert und bereinigt die geparste LLM-Antwort.
 * Gibt null zurück wenn alles valid ist, sonst eine deutsche Fehlermeldung.
 * Wendet Soft-Fallbacks für nicht-kritische Felder an (priority, deadline).
 */
function validateAndSanitizeLlmResponse(
  raw: Record<string, unknown>,
): string | null {
  // K.O.-Kriterium: title muss vorhanden und nicht leer sein
  if (!raw.title || typeof raw.title !== "string" || (raw.title as string).trim() === "") {
    return "Feld fehlt: title";
  }

  // K.O.-Kriterium: title zu lang deutet auf Halluzination hin
  if ((raw.title as string).trim().length > MAX_TITLE_LENGTH) {
    return `Titel zu lang (>${MAX_TITLE_LENGTH} Zeichen) — bitte kürzer formulieren`;
  }

  // Soft-Fallback: ungültige priority auf "medium" setzen
  if (!VALID_PRIORITIES.includes(raw.priority as typeof VALID_PRIORITIES[number])) {
    console.warn(`[Intent] Ungültige Priorität "${String(raw.priority)}" → Fallback: medium`);
    raw.priority = "medium";
  }

  // Soft-Fallback: deadline auf null setzen wenn kein String und nicht null
  if (raw.deadline !== null && typeof raw.deadline !== "string") {
    console.warn(`[Intent] Ungültiger deadline-Typ → Fallback: null`);
    raw.deadline = null;
  }

  // Semantische Prüfung: deadline-Format und nicht in der Vergangenheit
  if (typeof raw.deadline === "string") {
    const d = new Date(raw.deadline);
    if (isNaN(d.getTime())) {
      console.warn(`[Intent] Unparseable deadline "${raw.deadline}" → Fallback: null`);
      raw.deadline = null;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      if (d < yesterday) {
        return `Deadline liegt in der Vergangenheit: ${raw.deadline}`;
      }
    }
  }

  // Soft-Fallback: category leer → Fallback auf "Allgemein"
  if (!raw.category || typeof raw.category !== "string" || (raw.category as string).trim() === "") {
    console.warn(`[Intent] Leere category → Fallback: Allgemein`);
    raw.category = "Allgemein";
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
 * Response 422:  LLM-Antwort ungültig (K.O.-Kriterium nicht erfüllt)
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

  const validationError = validateAndSanitizeLlmResponse(raw);
  if (validationError !== null) {
    return res.status(422).json({ error: validationError, hint: "Bitte Eingabe klarer formulieren" });
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
