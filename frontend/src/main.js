// InferTask — main.js (Phase 1)
// Compiled-equivalent: TypeScript-Logik als ES2020 JavaScript
// Wird durch main.ts ersetzt sobald ein Build-Step eingerichtet ist (Phase 2)

// === State ===
let tasks = [];

// === DOM ===
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const completedList = document.getElementById('completed-list');
const completedSection = document.getElementById('completed-section');
const emptyHint = document.getElementById('empty-hint');

// === Hilfsfunktionen ===

function generateId() {
  return crypto.randomUUID();
}

function saveTasks() {
  localStorage.setItem('infertask-tasks', JSON.stringify(tasks));
}

function updateEmptyState() {
  const open = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);
  emptyHint.hidden = open.length > 0;
  completedSection.hidden = done.length === 0;
}

function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  const checkBtn = document.createElement('button');
  checkBtn.className = 'check-btn';
  checkBtn.title = task.completed ? 'Rückgängig' : 'Erledigen';
  checkBtn.textContent = task.completed ? '↺' : '✓';
  checkBtn.addEventListener('click', () => toggleTask(task.id));

  const span = document.createElement('span');
  span.className = 'task-title';
  span.textContent = task.title;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.title = 'Löschen';
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(checkBtn);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  if (task.completed) {
    completedList.appendChild(li);
  } else {
    taskList.appendChild(li);
  }
}

function addTask(title) {
  const task = {
    id: generateId(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  renderTask(task);
  saveTasks();
  updateEmptyState();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;

  // Element aus aktuellem Container entfernen und neu rendern
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el) el.remove();
  renderTask(task);
  saveTasks();
  updateEmptyState();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el) el.remove();
  saveTasks();
  updateEmptyState();
}

function loadTasks() {
  const raw = localStorage.getItem('infertask-tasks');
  if (!raw) return;
  tasks = JSON.parse(raw);
  tasks.forEach(task => renderTask(task));
  updateEmptyState();
}

// === Events ===
addBtn.addEventListener('click', () => {
  const title = input.value.trim();
  if (!title) return;
  addTask(title);
  input.value = '';
  input.focus();
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const title = input.value.trim();
    if (!title) return;
    addTask(title);
    input.value = '';
  }
});

// === Start ===
loadTasks();
