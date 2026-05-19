/**
 * API-Adapter für InferTask.
 * Alle Funktionen geben null zurück bei Netzwerkfehlern statt Exceptions zu werfen.
 * Ausnahme: intentTask() gibt { task, error } zurück damit Fehlermeldungen
 * aus dem Backend lesbar im Frontend angezeigt werden können.
 */

const API_BASE = "http://localhost:3000/api";

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

export async function loadSubtasks(taskId) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks`);
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error("[api] loadSubtasks:", e);
    return null;
  }
}

export async function loadRecommendations() {
  try {
    const res = await fetch(`${API_BASE}/recommendations`);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data.recommendations) ? data.recommendations : null;
  } catch (e) {
    console.error("[api] loadRecommendations:", e);
    return null;
  }
}

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

export async function intentTask(text) {
  try {
    const res = await fetch(`${API_BASE}/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      let message = `Fehler ${res.status}`;
      try {
        const body = await res.json();
        if (typeof body.error === "string") message = body.error;
      } catch { /* Body nicht parsebar */ }
      return { task: null, error: message };
    }
    const task = await res.json();
    return { task, error: null };
  } catch (e) {
    console.error("[api] intentTask:", e);
    return { task: null, error: "Netzwerkfehler – läuft das Backend?" };
  }
}

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

export async function completeSubtask(taskId, subtaskId) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: "PATCH",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error("[api] completeSubtask:", e);
    return null;
  }
}

export async function deleteTask(id) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (e) {
    console.error("[api] deleteTask:", e);
    return false;
  }
}
