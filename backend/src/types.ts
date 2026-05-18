/**
 * Gemeinsames Task-Interface als einzige Quelle der Wahrheit.
 * Wird von routes/tasks.ts, routes/goals.ts, dem SQLite-Layer
 * und dem Frontend-API-Adapter verwendet.
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  deadline?: string | null;
  priority?: "low" | "medium" | "high";
  category?: string;
}

/** Repräsentiert einen Subtask, der einem Eltern-Task zugeordnet ist. */
export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  ord: number;
}

/** Persistenter Nutzerkontext-Eintrag für die Memory-Tabelle. */
export interface MemoryEntry {
  id: string;
  key: string;
  value: string;
  createdAt: string;
}
