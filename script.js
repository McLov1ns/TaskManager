document.addEventListener("DOMContentLoaded", function () {
    loadTasks('active-tasks-container');
});

function loadTasks(containerId) {
    const tasks = readTasksFromLocalStorage();
    renderTasks(tasks, containerId);
}

function addTask() {
    const newTaskInput = document.getElementById('new-task');
    const newTask = newTaskInput.value.trim();
    if (newTask !== "") {
        const tasks = readTasksFromLocalStorage();
        tasks.push({ id: Date.now(), text: newTask, completed: false, deleted: false });
        saveTasksToLocalStorage(tasks);
        renderTasks(tasks, 'active-tasks-container');
        newTaskInput.value = "";
    }
}

function markCompleted(taskId, currentContainerId) {
    const tasks = readTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = true;
        saveTasksToLocalStorage(tasks);
        renderTasks(tasks, currentContainerId);
    }
}

function deleteTask(taskId, currentContainerId) {
    const tasks = readTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].deleted = true;
        saveTasksToLocalStorage(tasks);
        renderTasks(tasks, currentContainerId);
    }
}

function permanentlyDeleteTask(taskId, currentContainerId) {
    const tasks = readTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasksToLocalStorage(tasks);
        renderTasks(tasks, currentContainerId);
    }
}

function restoreTask(taskId, currentContainerId) {
    const tasks = readTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].deleted = false;
        saveTasksToLocalStorage(tasks);
        renderTasks(tasks, currentContainerId);
    }
}

function deleteCompletedTask(taskId, currentContainerId) {
    const tasks = readTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId && task.completed);
    if (taskIndex !== -1) {
        tasks[taskIndex].deleted = true;
        tasks[taskIndex].completed = false;
        saveTasksToLocalStorage(tasks);
        renderTasks(tasks, currentContainerId);
    }
}


function readTasksFromLocalStorage() {
    const tasksString = localStorage.getItem('tasks');
    return tasksString ? JSON.parse(tasksString) : [];
}

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(tasks, containerId) {
    const activeTasksList = document.getElementById('active-tasks');
    const completedTasksList = document.getElementById('completed-tasks');
    const deletedTasksList = document.getElementById('deleted-tasks');

    activeTasksList.innerHTML = "";
    completedTasksList.innerHTML = "";
    deletedTasksList.innerHTML = "";

    tasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.innerHTML = `<span>${task.text}</span>`;
        if (task.completed) {
            taskElement.classList.add('completed');
            taskElement.innerHTML += `<button onclick="deleteCompletedTask(${task.id}, 'completed-tasks-container')">Удалить</button>`;
            completedTasksList.appendChild(taskElement);
        } else if (task.deleted) {
            taskElement.classList.add('deleted');
            taskElement.innerHTML += `<div>`;
            taskElement.innerHTML += `<button onclick="permanentlyDeleteTask(${task.id}, 'deleted-tasks-container')">Удалить навсегда</button>`;
            taskElement.innerHTML += `<button onclick="restoreTask(${task.id}, 'deleted-tasks-container')">Восстановить</button>`;
            taskElement.innerHTML += `</div>`;
            deletedTasksList.appendChild(taskElement);
        } else {
            taskElement.innerHTML += `<button onclick="markCompleted(${task.id}, 'active-tasks-container')">Выполнено</button>`;
            taskElement.innerHTML += `<button onclick="deleteTask(${task.id}, 'active-tasks-container')">Удалить</button>`;
            activeTasksList.appendChild(taskElement);
        }
    });

    toggleTasks(containerId);
}

function toggleTasks(containerId) {
    const containers = ['active-tasks-container', 'completed-tasks-container', 'deleted-tasks-container'];
    containers.forEach(container => {
        const element = document.getElementById(container);
        if (container === containerId) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}
