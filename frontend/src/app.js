const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const completedList = document.getElementById("completed-list");

const openModalBtn = document.getElementById("open-modal-btn");
const modalOverlay = document.getElementById("modal-overlay");
const modalCancel = document.getElementById("modal-cancel");
const modalSave = document.getElementById("modal-save");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");

const STORAGE_KEY = "myTasks";

addTaskBtn.addEventListener("click", addTask);
document.addEventListener("DOMContentLoaded", loadTasks);

openModalBtn.addEventListener("click", function() {
  modalOverlay.hidden = false;
  modalTitle.focus();
});

modalCancel.addEventListener("click", function() {
  modalOverlay.hidden = true;
  modalTitle.value = "";
  modalDesc.value = "";
});

modalSave.addEventListener("click", function() {
  const title = modalTitle.value.trim();
  if (!title) return;
  createTaskElement(title, modalDesc.value.trim());
  modalOverlay.hidden = true;
  modalTitle.value = "";
  modalDesc.value = "";
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  createTaskElement(taskText, "Neu hinzugefügte Aufgabe");
  taskInput.value = "";
  taskInput.focus();
}

function createTaskElement(titleText, descText) {
  const taskItem = document.createElement("li");
  taskItem.className = "task-item";

  const checkButton = document.createElement("button");
  checkButton.className = "check-circle";
  checkButton.setAttribute("aria-label", "Aufgabe als erledigt markieren");

  const taskContent = document.createElement("div");
  taskContent.className = "task-content";

  const taskTitle = document.createElement("h2");
  taskTitle.textContent = titleText;

  const taskDescription = document.createElement("p");
  taskDescription.textContent = descText || "";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.setAttribute("aria-label", "Aufgabe Löschen");
  deleteButton.textContent = "×";

  deleteButton.addEventListener("click", function() {
    taskItem.remove();
  });

  checkButton.addEventListener("click", function() {
    moveToCompleted(taskItem, checkButton, deleteButton);
  });

  taskContent.appendChild(taskTitle);
  taskContent.appendChild(taskDescription);
  taskItem.appendChild(checkButton);
  taskItem.appendChild(taskContent);
  taskItem.appendChild(deleteButton);
  taskList.appendChild(taskItem);
}

function moveToCompleted(taskItem, checkButton, deleteButton) {
  taskItem.classList.add("completed");
  checkButton.classList.add("done");
  checkButton.setAttribute("aria-label", "Erledigte Aufgabe");
  deleteButton.remove();
  completedList.appendChild(taskItem);
}

function loadTasks() {
  // localStorage-Persistenz kommt in einem späteren Schritt
}
