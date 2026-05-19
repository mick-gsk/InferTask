import { HarnessConfig, runHarness, HarnessResult } from "../harness.js";
import { buildIntentCompilerPrompt } from "../prompts/intent-compiler.js";
import taskSchema from "../schemas/task.schema.json" assert { type: "json" };
import { Task } from "../../types.js";

const VALID_PRIORITIES = ["low", "medium", "high"] as const;
const MAX_TITLE_LENGTH = 120;

const intentCompilerConfig: HarnessConfig<Omit<Task, "id" | "description" | "completed" | "createdAt">> = {
  name: "intent-compiler",
  buildSystemPrompt: buildIntentCompilerPrompt,
  schema: taskSchema as Record<string, unknown>,
  maxRetries: 2,

  validateAndSanitize(raw) {
    // K.O.: title fehlt oder leer
    if (!raw.title || typeof raw.title !== "string" || (raw.title as string).trim() === "") {
      return "Feld fehlt: title";
    }
    // K.O.: title zu lang (Halluzinations-Indikator)
    if ((raw.title as string).trim().length > MAX_TITLE_LENGTH) {
      return `Titel zu lang (>${MAX_TITLE_LENGTH} Zeichen) — bitte kürzer formulieren`;
    }

    // Soft-Fallback: ungültige priority
    if (!VALID_PRIORITIES.includes(raw.priority as typeof VALID_PRIORITIES[number])) {
      raw.priority = "medium";
    }

    // Soft-Fallback: deadline falscher Typ
    if (raw.deadline !== null && typeof raw.deadline !== "string") {
      raw.deadline = null;
    }

    // Semantisch: deadline in Vergangenheit oder unparseable
    if (typeof raw.deadline === "string") {
      const d = new Date(raw.deadline);
      if (isNaN(d.getTime())) {
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

    // Soft-Fallback: leere category
    if (!raw.category || typeof raw.category !== "string" || (raw.category as string).trim() === "") {
      raw.category = "Allgemein";
    }

    return null;
  },

  mapOutput(raw) {
    return {
      title: (raw.title as string).trim(),
      deadline: typeof raw.deadline === "string" ? raw.deadline : null,
      priority: raw.priority as Task["priority"],
      category: (raw.category as string).trim(),
    };
  },
};

/** Führt den Intent-Compiler-Harness aus und gibt ein typisiertes Result zurück. */
export function runIntentCompiler(
  userInput: string,
): Promise<HarnessResult<Omit<Task, "id" | "description" | "completed" | "createdAt">>> {
  return runHarness(intentCompilerConfig, userInput);
}
