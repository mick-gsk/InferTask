import express, { Request, Response } from "express";
import db from "../db.js";
import { runIntentCompiler } from "../llm/harnesses/intent-compiler.js";
import { Task } from "../types.js";

const router = express.Router();

/**
 * POST /api/intent
 * Nimmt deutschen Freitext entgegen, lässt den Intent-Compiler-Harness
 * einen strukturierten Task daraus ableiten und speichert ihn.
 *
 * Body:          { text: string }
 * Response 201:  Task-Objekt
 * Response 400:  fehlender/leerer text
 * Response 422:  LLM-Antwort besteht Validierung nicht
 * Response 503:  Ollama nicht erreichbar
 */
router.post("/", async function (req: Request, res: Response) {
  const { text } = req.body as { text: unknown };
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "text erforderlich" });
  }

  const result = await runIntentCompiler(text.trim());

  if (!result.ok) {
    const status = result.errorType === "llm_unavailable" ? 503 : 422;
    return res.status(status).json({
      error: result.message,
      ...(result.errorType === "validation_failed"
        ? { hint: "Bitte Eingabe klarer formulieren" }
        : {}),
    });
  }

  const task: Task = {
    id: crypto.randomUUID(),
    description: "",
    completed: false,
    createdAt: new Date().toISOString(),
    ...result.data,
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
