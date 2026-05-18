import { MODEL_NAME } from "../config.js";

const OLLAMA_URL =
  process.env.OLLAMA_URL ?? "http://localhost:11434/api/generate";

/**
 * Sendet einen einfachen Prompt an Ollama und gibt den Roh-Text zurück.
 * Für Plain-Text-Anwendungsfälle (z.B. /api/infer).
 * Gibt null zurück wenn Ollama nicht erreichbar ist.
 */
export async function askOllama(prompt: string): Promise<string | null> {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL_NAME, prompt, stream: false }),
    });
    const data = await response.json();
    return typeof data.response === "string" ? data.response : null;
  } catch (error) {
    console.error("[Ollama] Fehler beim Abrufen:", error);
    return null;
  }
}

/**
 * Sendet einen strukturierten Prompt mit JSON-Schema-Constraint an Ollama.
 * Nutzt das `format`-Feld der Ollama-API für Structured Output.
 *
 * @param systemPrompt - System-Prompt (z.B. aus buildIntentCompilerPrompt())
 * @param userInput    - Freitext-Eingabe des Nutzers
 * @param schema       - JSON Schema Objekt (z.B. aus task.schema.json)
 * @returns Geparste JSON-Antwort als Record oder null bei Fehler
 */
export async function askOllamaStructured(
  systemPrompt: string,
  userInput: string,
  schema: Record<string, unknown>,
): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        system: systemPrompt,
        prompt: userInput,
        format: schema,
        stream: false,
      }),
    });
    if (!response.ok) {
      console.error("[Ollama] HTTP-Fehler:", response.status);
      return null;
    }
    const data = await response.json();
    if (typeof data.response !== "string") return null;
    return JSON.parse(data.response) as Record<string, unknown>;
  } catch (error) {
    console.error("[Ollama] Fehler bei Structured Output:", error);
    return null;
  }
}
