import { MODEL_NAME } from "../config.js";

const OLLAMA_URL =
  process.env.OLLAMA_URL ?? "http://localhost:11434/api/generate";

/**
 * Sendet einen Prompt an das lokale Ollama-Modell.
 * Gibt null zurück wenn Ollama nicht erreichbar ist oder ein Fehler auftritt.
 */
async function askOllama(prompt: string): Promise<string | null> {
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

export { askOllama };
