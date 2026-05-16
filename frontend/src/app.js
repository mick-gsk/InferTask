const taskList = document.getElementById("task-list");
const completedList = document.getElementById("completed-list");
const modal = document.getElementById("task-modal");
const modalTitle = document.getElementById("modal-task-title");
const modalDescription = document.getElementById("modal-task-description");

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
    closeModal();
});

function addTask(title, description) {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";

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
        taskItem.remove();
    });

    checkButton.addEventListener("click", function () {
        moveToCompleted(taskItem, checkButton, deleteButton);
    });

    taskContent.appendChild(taskTitleEl);
    taskContent.appendChild(taskDescEl);
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
