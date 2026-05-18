/**
 * API-Adapter für InferTask.
 * Ersetzt die localStorage-Persistenz durch fetch()-Aufrufe gegen das Express-Backend.
 * Alle Funktionen geben null zurück bei Netzwerkfehlern statt Exceptions zu werfen.
 *
 * Spätere Erweiterung: API_BASE aus einer Konfig-Datei oder env lesen.
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
 * Legt einen neuen Task an.
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
