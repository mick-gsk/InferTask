/**
 * Gemeinsames Task-Interface als einzige Quelle der Wahrheit für das Task-Datenschema.
 * Wird von backend/src/routes/tasks.ts, der späteren SQLite-Schicht
 * und dem Frontend-API-Adapter verwendet.
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}
