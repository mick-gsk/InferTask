import { saveTasks, loadTasksFromStorage } from "./storage.js";
import { intentTask } from "./api.js";

const taskList = document.getElementById("task-list");
const completedList = document.getElementById("completed-list");
const modal = document.getElementById("task-modal");
const modalTitle = document.getElementById("modal-task-title");
const modalDescription = document.getElementById("modal-task-description");
const llmToggle = document.getElementById("llm-mode-toggle");
const manualInputs = document.getElementById("manual-inputs");
const llmInputs = document.getElementById("llm-inputs");
const llmFreetext = document.getElementById("llm-freetext");
const modalError = document.getElementById("modal-error");
const saveBtn = document.getElementById("save-task-btn");

const tasks = [];

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

function openModal() {
  modal.classList.remove("hidden");
  hideModalError();
  modalTitle.focus();
}

function closeModal() {
  modal.classList.add("hidden");
  modalTitle.value = "";
  modalDescription.value = "";
  llmFreetext.value = "";
  llmToggle.checked = false;
  manualInputs.classList.remove("hidden");
  llmInputs.classList.add("hidden");
  hideModalError();
}

function showModalError(msg) {
  modalError.textContent = msg;
  modalError.classList.remove("hidden");
}

function hideModalError() {
  modalError.textContent = "";
  modalError.classList.add("hidden");
}

document.getElementById("new-task-btn").addEventListener("click", openModal);
document.getElementById("cancel-task-btn").addEventListener("click", closeModal);
document.getElementById("modal-overlay").addEventListener("click", closeModal);

llmToggle.addEventListener("change", function () {
  if (llmToggle.checked) {
    manualInputs.classList.add("hidden");
    llmInputs.classList.remove("hidden");
    llmFreetext.focus();
  } else {
    manualInputs.classList.remove("hidden");
    llmInputs.classList.add("hidden");
    modalTitle.focus();
  }
  hideModalError();
});

saveBtn.addEventListener("click", async function () {
  hideModalError();

  if (llmToggle.checked) {
    const text = llmFreetext.value.trim();
    if (text === "") return;
    saveBtn.disabled = true;
    saveBtn.textContent = "Analysiere...";
    const { task, error } = await intentTask(text);
    saveBtn.disabled = false;
    saveBtn.textContent = "Speichern";
    if (error) {
      showModalError(error);
      return;
    }
    addTaskFromApi(task);
    closeModal();
  } else {
    const title = modalTitle.value.trim();
    if (title === "") return;
    addTask(title, modalDescription.value.trim());
    saveTasks(tasks);
    closeModal();
  }
});

// ---------------------------------------------------------------------------
// Task-Logik
// ---------------------------------------------------------------------------

function createTaskObject(title, description, completed) {
  return {
    id: crypto.randomUUID(),
    title: title,
    description: description ?? "",
    completed: completed === true,
    createdAt: new Date().toISOString(),
  };
}

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

function addTask(title, description, completed = false) {
  const task = createTaskObject(title, description, completed);
  tasks.push(task);
  const el = renderTask(task);
  (completed ? completedList : taskList).appendChild(el);
}

function addTaskFromApi(task) {
  tasks.push(task);
  taskList.appendChild(renderTask(task));
}

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
