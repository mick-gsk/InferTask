/**
 * API-Adapter für InferTask.
 * Alle Funktionen geben null zurück bei Netzwerkfehlern statt Exceptions zu werfen.
 */

const API_BASE = "http://localhost:3000/api";

/**
 * Lädt alle Tasks vom Backend.
 * @returns {Promise<Array|null>}
 */
export async function loadTasksFromApi() {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error("[api] loadTasksFromApi:", e);
    return null;
  }
}

/**
 * Legt einen neuen Task manuell an.
 * @param {string} title
 * @param {string} description
 * @returns {Promise<Object|null>}
 */
export async function createTask(title, description) {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error("[api] createTask:", e);
    return null;
  }
}

/**
 * Sendet Freitext an den Intent Compiler.
 * Das LLM leitet daraus einen strukturierten Task ab und speichert ihn.
 * @param {string} text - Freier Eingabetext
 * @returns {Promise<Object|null>} - Task-Objekt oder null bei Fehler
 */
export async function intentTask(text) {
  try {
    const res = await fetch(`${API_BASE}/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error("[api] intentTask:", e);
    return null;
  }
}

/**
 * Markiert einen Task als erledigt.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function completeTask(id) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "PATCH" });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error("[api] completeTask:", e);
    return null;
  }
}

/**
 * Löscht einen Task.
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteTask(id) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (e) {
    console.error("[api] deleteTask:", e);
    return false;
  }
}
