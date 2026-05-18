import express, { Request, Response } from "express";
import { askOllama } from "../llm/ollama.js";

const router = express.Router();

/**
 * POST /api/infer
 * Einstiegspunkt für die LLM-/Intent-Compiler-Integration.
 * Nimmt freien Text entgegen, leitet ihn an Ollama weiter
 * und gibt den Roh-Output zurück.
 *
 * Spätere Erweiterung: Output wird durch den Intent-Compiler
 * in ein strukturiertes Task-Objekt übersetzt.
 */
router.post("/", async function (req: Request, res: Response) {
  const { input } = req.body as { input: unknown };
  if (!input || typeof input !== "string" || input.trim() === "") {
    return res.status(400).json({ error: "input required" });
  }
  const result = await askOllama(input.trim());
  if (result === null) {
    return res
      .status(503)
      .json({ error: "LLM not available – is Ollama running?" });
  }
  res.json({ raw: result });
});

export default router;
