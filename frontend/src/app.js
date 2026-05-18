import { saveTasks, loadTasksFromStorage } from "./storage.js";

const taskList = document.getElementById("task-list");
const completedList = document.getElementById("completed-list");
const modal = document.getElementById("task-modal");
const modalTitle = document.getElementById("modal-task-title");
const modalDescription = document.getElementById("modal-task-description");

/** Zentraler In-Memory-State. Wird durch die API später ersetzt. */
const tasks = [];

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

function openModal() {
  modal.classList.remove("hidden");
  modalTitle.focus();
}

function closeModal() {
  modal.classList.add("hidden");
  modalTitle.value = "";
  modalDescription.value = "";
}

document.getElementById("new-task-btn").addEventListener("click", openModal);
document.getElementById("cancel-task-btn").addEventListener("click", closeModal);
document.getElementById("modal-overlay").addEventListener("click", closeModal);

document.getElementById("save-task-btn").addEventListener("click", function () {
  const title = modalTitle.value.trim();
  if (title === "") return;
  const description = modalDescription.value.trim();
  addTask(title, description);
  saveTasks(tasks);
  closeModal();
});

// ---------------------------------------------------------------------------
// Task-Logik
// ---------------------------------------------------------------------------

/**
 * Erzeugt ein reines Task-Datenobjekt ohne DOM-Zugriff.
 * Entspricht dem gemeinsamen Task-Interface aus backend/src/types.ts.
 * @param {string} title
 * @param {string} description
 * @param {boolean} completed
 * @returns {Object}
 */
function createTaskObject(title, description, completed) {
  return {
    id: crypto.randomUUID(),
    title: title,
    description: description ?? "",
    completed: completed === true,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Baut das DOM-Element für einen Task.
 * Hat keinen Zugriff auf den globalen tasks[]-State.
 * @param {Object} task
 * @returns {HTMLElement}
 */
function renderTask(task) {
  const taskItem = document.createElement("div");
  taskItem.className = "task-item";
  taskItem.setAttribute("data-id", task.id);

  const checkButton = document.createElement("button");
  checkButton.className = "check-circle";
  checkButton.setAttribute("aria-label", "Aufgabe als erledigt markieren");

  const taskContent = document.createElement("div");
  taskContent.className = "task-content";

  const taskTitleEl = document.createElement("h2");
  taskTitleEl.textContent = task.title;

  const taskDescEl = document.createElement("p");
  taskDescEl.textContent = task.description || "";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.setAttribute("aria-label", "Aufgabe löschen");
  deleteButton.textContent = "×";

  deleteButton.addEventListener("click", function () {
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) tasks.splice(index, 1);
    taskItem.remove();
    saveTasks(tasks);
  });

  checkButton.addEventListener("click", function () {
    moveToCompleted(task, taskItem, checkButton, deleteButton);
  });

  taskContent.appendChild(taskTitleEl);
  taskContent.appendChild(taskDescEl);
  taskItem.appendChild(checkButton);
  taskItem.appendChild(taskContent);
  taskItem.appendChild(deleteButton);

  if (task.completed) {
    taskItem.classList.add("completed");
    checkButton.classList.add("done");
    deleteButton.remove();
  }

  return taskItem;
}

/**
 * Erstellt Task-Objekt, registriert es im State und hängt das DOM-Element ein.
 * @param {string} title
 * @param {string} description
 * @param {boolean} completed
 */
function addTask(title, description, completed = false) {
  const task = createTaskObject(title, description, completed);
  tasks.push(task);
  const el = renderTask(task);
  (completed ? completedList : taskList).appendChild(el);
}

/**
 * Markiert einen Task als erledigt: aktualisiert State, DOM und Persistenz.
 * @param {Object} task
 * @param {HTMLElement} taskItem
 * @param {HTMLElement} checkButton
 * @param {HTMLElement} deleteButton
 */
function moveToCompleted(task, taskItem, checkButton, deleteButton) {
  const stateTask = tasks.find((t) => t.id === task.id);
  if (stateTask) stateTask.completed = true;
  taskItem.classList.add("completed");
  checkButton.classList.add("done");
  checkButton.setAttribute("aria-label", "Erledigte Aufgabe");
  deleteButton.remove();
  completedList.appendChild(taskItem);
  saveTasks(tasks);
}

// ---------------------------------------------------------------------------
// Initialisierung
// ---------------------------------------------------------------------------

loadTasksFromStorage().forEach(function (task) {
  addTask(task.title, task.description, task.completed);
});
