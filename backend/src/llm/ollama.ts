import { MODEL_NAME } from "../config.js";

const OLLAMA_URL =
  process.env.OLLAMA_URL ?? "http://localhost:11434/api/generate";

export const OLLAMA_TIMEOUT_MS = 15_000;
export const MAX_INPUT_CHARS = 2000;
export const MAX_OUTPUT_TOKENS = 300;

/**
 * Sendet einen einfachen Prompt an Ollama und gibt den Roh-Text zurück.
 * Kein Retry — für Plain-Text-Anwendungsfälle (z.B. /api/infer).
 */
export async function askOllama(
  prompt: string,
  timeoutMs = OLLAMA_TIMEOUT_MS,
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
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
 * Gibt geparste JSON-Antwort zurück oder null bei Fehler.
 * Retry-Logik liegt in harness.ts — diese Funktion ist bewusst stateless.
 */
export async function askOllamaStructured(
  systemPrompt: string,
  userInput: string,
  schema: Record<string, unknown>,
  timeoutMs = OLLAMA_TIMEOUT_MS,
): Promise<Record<string, unknown> | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
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
      console.error(`[Ollama] HTTP ${response.status}`);
      return null;
    }
    const data = await response.json();
    if (typeof data.response !== "string") {
      console.error("[Ollama] Unexpected response shape", data);
      return null;
    }
    try {
      return JSON.parse(data.response) as Record<string, unknown>;
    } catch {
      console.error("[Ollama] JSON.parse failed:", data.response);
      return null;
    }
  } catch (error) {
    clearTimeout(timer);
    const reason = (error as Error).name === "AbortError" ? "timeout" : "network";
    console.error(`[Ollama] askOllamaStructured reason=${reason}`, error);
    return null;
  }
}
