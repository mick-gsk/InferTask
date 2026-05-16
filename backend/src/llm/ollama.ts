import { MODEL_NAME } from "../config.js";

async function askOllama(prompt: string) {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL_NAME, prompt, stream: false }),
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(error);
  }
}

export { askOllama };
