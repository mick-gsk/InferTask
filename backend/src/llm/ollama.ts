import { MODEL_NAME } from "../config.js";

const OLLAMA_URL =
  process.env.OLLAMA_URL ?? "http://localhost:11434/api/generate";

const OLLAMA_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 2;
const MAX_INPUT_CHARS = 2000;
const MAX_OUTPUT_TOKENS = 300;

/**
 * Sendet einen einfachen Prompt an Ollama und gibt den Roh-Text zurück.
 * Für Plain-Text-Anwendungsfälle (z.B. /api/infer).
 * Gibt null zurück wenn Ollama nicht erreichbar ist.
 */
export async function askOllama(prompt: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);
  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt.slice(0, MAX_INPUT_CHARS),
        stream: false,
        options: { num_predict: MAX_OUTPUT_TOKENS },
      }),
    });
    clearTimeout(timer);
    const data = await response.json();
    return typeof data.response === "string" ? data.response : null;
  } catch (error) {
    clearTimeout(timer);
    const reason = (error as Error).name === "AbortError" ? "timeout" : "network";
    console.error(`[Ollama] askOllama reason=${reason}`, error);
    return null;
  }
}

/**
 * Sendet einen strukturierten Prompt mit JSON-Schema-Constraint an Ollama.
 * Nutzt das `format`-Feld der Ollama-API für Structured Output.
 * Wiederholt den Request bis zu MAX_RETRIES mal bei transienten Fehlern.
 *
 * @param systemPrompt - System-Prompt (z.B. aus buildIntentCompilerPrompt())
 * @param userInput    - Freitext-Eingabe des Nutzers (wird auf MAX_INPUT_CHARS begrenzt)
 * @param schema       - JSON Schema Objekt (z.B. aus task.schema.json)
 * @returns Geparste JSON-Antwort als Record oder null bei Fehler
 */
export async function askOllamaStructured(
  systemPrompt: string,
  userInput: string,
  schema: Record<string, unknown>,
): Promise<Record<string, unknown> | null> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);
    try {
      const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: MODEL_NAME,
          system: systemPrompt,
          prompt: userInput.slice(0, MAX_INPUT_CHARS),
          format: schema,
          stream: false,
          options: { num_predict: MAX_OUTPUT_TOKENS },
        }),
      });
      clearTimeout(timer);
      if (!response.ok) {
        console.error(`[Ollama] HTTP ${response.status} (attempt=${attempt})`);
        continue;
      }
      const data = await response.json();
      if (typeof data.response !== "string") {
        console.error(`[Ollama] Unexpected response shape (attempt=${attempt})`, data);
        continue;
      }
      return JSON.parse(data.response) as Record<string, unknown>;
    } catch (error) {
      clearTimeout(timer);
      const reason = (error as Error).name === "AbortError" ? "timeout" : "network/parse";
      console.error(`[Ollama] attempt=${attempt} reason=${reason}`, error);
    }
  }
  return null;
}
