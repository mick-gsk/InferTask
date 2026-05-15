// InferTask — main.ts
// Phase 1: Basis-CRUD ohne LLM
// TODO: LLM-Anbindung kommt in Phase 3

// === Typen ===
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

// === State ===
let tasks: Task[] = [];

// === DOM-Referenzen ===
const input = document.getElementById('task-input') as HTMLInputElement;
const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
const taskList = document.getElementById('task-list') as HTMLElement;

// === Funktionen ===

function generateId(): string {
  // TODO: crypto.randomUUID() oder eigene Implementierung
  return '';
}

function saveTasks(): void {
  // TODO: Tasks in localStorage speichern
}

function loadTasks(): void {
  // TODO: Tasks aus localStorage laden und rendern
}

function renderTask(task: Task): void {
  // TODO: Task-Element erzeugen und in #task-list einfügen
}

function addTask(title: string): void {
  // TODO: Neuen Task anlegen, speichern und rendern
}

// === Events ===
addBtn.addEventListener('click', () => {
  const title = input.value.trim();
  if (title) {
    addTask(title);
    input.value = '';
  }
});

// TODO: Enter-Taste ebenfalls auslösen

// === Start ===
loadTasks();
