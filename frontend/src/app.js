const taskList = document.getElementById("task-list");
const completedList = document.getElementById("completed-list");
const modal = document.getElementById("task-modal");
const modalTitle = document.getElementById("modal-task-title");
const modalDescription = document.getElementById("modal-task-description");
const tasks = [];

function generateId() {
  return crypto.randomUUID();
}

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
document
  .getElementById("cancel-task-btn")
  .addEventListener("click", closeModal);
document.getElementById("modal-overlay").addEventListener("click", closeModal);

document.getElementById("save-task-btn").addEventListener("click", function () {
  const title = modalTitle.value.trim();
  if (title === "") return;
  const description = modalDescription.value.trim();
  addTask(title, description);
  saveTasks();
  closeModal();
});

function addTask(title, description, completed = false) {
  const id = generateId();
  tasks.push({
    title: title,
    description: description,
    completed: completed,
    id: id,
  });
  const taskItem = document.createElement("div");
  taskItem.className = "task-item";
  taskItem.setAttribute("data-id", id);

  const checkButton = document.createElement("button");
  checkButton.className = "check-circle";
  checkButton.setAttribute("aria-label", "Aufgabe als erledigt markieren");

  const taskContent = document.createElement("div");
  taskContent.className = "task-content";

  const taskTitleEl = document.createElement("h2");
  taskTitleEl.textContent = title;

  const taskDescEl = document.createElement("p");
  taskDescEl.textContent = description || "";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.setAttribute("aria-label", "Aufgabe löschen");
  deleteButton.textContent = "×";

  deleteButton.addEventListener("click", function () {
    const taskId = taskItem.getAttribute("data-id");
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) tasks.splice(taskIndex, 1);
    taskItem.remove();
    saveTasks();
  });

  checkButton.addEventListener("click", function () {
    moveToCompleted(taskItem, checkButton, deleteButton);
    saveTasks();
  });

  taskContent.appendChild(taskTitleEl);
  taskContent.appendChild(taskDescEl);
  taskItem.appendChild(checkButton);
  taskItem.appendChild(taskContent);
  taskItem.appendChild(deleteButton);
  if (completed) {
    taskItem.classList.add("completed");
    checkButton.classList.add("done");
    completedList.appendChild(taskItem);
  } else {
    taskList.appendChild(taskItem);
  }
}

function moveToCompleted(taskItem, checkButton, deleteButton) {
  const taskId = taskItem.getAttribute("data-id");
  const task = tasks.find((t) => t.id === taskId);
  if (task) task.completed = true;
  taskItem.classList.add("completed");
  checkButton.classList.add("done");
  checkButton.setAttribute("aria-label", "Erledigte Aufgabe");
  deleteButton.remove();
  completedList.appendChild(taskItem);
  saveTasks();
}

function saveTasks() {
  localStorage.setItem("infertask-tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const rawTasks = localStorage.getItem("infertask-tasks");
  if (!rawTasks) return;
  const savedTasks = JSON.parse(rawTasks);
  savedTasks.forEach(function (task) {
    addTask(task.title, task.description, task.completed);
  });
}

loadTasks();
