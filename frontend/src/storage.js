const STORAGE_KEY = "infertask-tasks";

/**
 * Speichert das übergebene Task-Array in localStorage.
 * Schlägt lautlos fehl wenn QuotaExceeded oder Serialisierungsfehler auftritt.
 * @param {Array} tasks
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn("[storage] Konnte nicht speichern:", e);
  }
}

/**
 * Lädt und validiert Tasks aus localStorage.
 * Gibt ein leeres Array zurück bei fehlendem, leerem oder korrumpiertem Eintrag.
 * Löscht korrumpierte Daten automatisch.
 * @returns {Array}
 */
export function loadTasksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t) => typeof t.title === "string" && t.title.trim() !== "",
    ).map((t) => ({
      ...t,
      // Fallback für Tasks, die vor Einführung von createdAt gespeichert wurden
      createdAt: t.createdAt ?? new Date(0).toISOString(),
    }));
  } catch {
    console.warn("[storage] Daten korrumpiert – localStorage wird zurückgesetzt.");
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}
