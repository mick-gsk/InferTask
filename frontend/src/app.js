const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const completedList = document.getElementById("completed-list");

const STORAGE_KEY = "myTasks";

addTaskBtn.addEventListener("click", addTask);
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }


    const taskItem = createTaskElement(taskText)
    taskItem.className = "task-item";

    const checkButton = document.createElement("button");
    checkButton.className = "check-circle";
    checkButton.setAttribute("aria-label", "Aufgabe als erledigt markieren");

    const taskContent =  document.createElement("div");
    taskContent.className = "task-content";

    const taskTitle = document.createElement("h2");
    taskTitle.textContent = taskText;

    const taskDescription = document.createElement("p");
    taskDescription.textContent = "Neu hinzugefügte Aufgabe";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.setAttribute("aria-label", "Aufgabe Löschen");
    deleteButton.textContent = "x";

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

    taskInput.value = "";
    taskInput.focus();
}

function moveToCompleted(taskItem, checkButton, deleteButton) {
    taskItem.classList.add("completed");
    checkButton.classList.add("done");
    checkButton.setAttribute("aria-label", "Erledigte Aufgabe");
    deleteButton.remove();

    completedList.appendChild(taskItem);
}
