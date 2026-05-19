import express, { Request, Response } from "express";
import db from "../db.js";
import { askOllamaStructured } from "../llm/ollama.js";
import { buildDecisionCompressionPrompt } from "../llm/prompts/decision-compression.js";
import recommendationsSchema from "../llm/schemas/recommendations.schema.json" assert { type: "json" };

const router = express.Router();

const MAX_TASKS = 20;

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

interface TaskRow {
  id: string;
  title: string;
  priority: string;
  deadline: string | null;
}

function validateRecommendations(
  raw: Record<string, unknown>,
  validIds: Set<string>,
): string | null {
  const recs = raw["recommendations"];
  if (!Array.isArray(recs)) return "recommendations-Array fehlt in LLM-Antwort";
  if (recs.length > 3) return `recommendations darf max. 3 Einträge haben, erhalten: ${recs.length}`;
  for (const id of recs) {
    if (typeof id !== "string") return "Empfehlung ist kein String";
    if (!validIds.has(id)) return `Unbekannte Task-ID in Empfehlungen: ${id}`;
  }
  return null;
}

/**
 * GET /api/recommendations
 * Lädt bis zu 20 offene Tasks, sendet sie ans LLM und gibt 1–3 empfohlene Task-IDs zurück.
 *
 * Response 200: { recommendations: string[] }
 * Response 503: Ollama nicht erreichbar
 * Response 422: LLM-Antwort ungültig
 */
router.get("/", async function (_req: Request, res: Response) {
  const rows = db
    .prepare(
      `SELECT id, title, priority, deadline
       FROM tasks
       WHERE completed = 0
       ORDER BY
         CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END ASC,
         CASE WHEN deadline IS NULL THEN 1 ELSE 0 END ASC,
         deadline ASC
       LIMIT ?`,
    )
    .all(MAX_TASKS) as TaskRow[];

  if (rows.length === 0) {
    return res.json({ recommendations: [] });
  }

  const validIds = new Set(rows.map((r) => r.id));
  const taskListJson = JSON.stringify(
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      priority: r.priority ?? "medium",
      deadline: r.deadline ?? null,
    })),
  );

  const prompt = buildDecisionCompressionPrompt();
  const raw = await askOllamaStructured(
    prompt,
    taskListJson,
    recommendationsSchema as Record<string, unknown>,
  );

  if (raw === null) {
    return res.status(503).json({
      error: "LLM nicht verfügbar oder ungültiges JSON – läuft Ollama?",
    });
  }

  const validationError = validateRecommendations(raw, validIds);
  if (validationError !== null) {
    return res.status(422).json({
      error: validationError,
      hint: "Bitte erneut versuchen",
    });
  }

  res.json({ recommendations: raw["recommendations"] as string[] });
});

export default router;
