function darkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
};

window.onload = function () {
    loadTasks();

    // On form submit add task
    document.querySelector("form").addEventListener("submit", e => {
        e.preventDefault();
        addTask();

    });
};

function loadTasks() {
    const tasksArray = JSON.parse(localStorage.getItem("tasks") || "[]");

    // Clear existing content in the task list
    const taskList = document.querySelector("ul");
    taskList.innerHTML = "";

    // Check if there are tasks in localStorage
    if (tasksArray.length === 0) {
        const empty = document.createElement("div");
        empty.innerHTML = `<p>You have no current tasks</p>`;
        const taskListContainer = document.querySelector("#task-list");
        taskListContainer.appendChild(empty);
    } else {
        // Remove the "You have no current tasks" message if it exists
        const emptyMessage = document.querySelector("#task-list div");
        if (emptyMessage) {
            emptyMessage.remove();
        }
        // Loop through the tasks and add them to the list
        tasksArray.forEach(task => {
            const li = document.createElement("li");
            li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
            <input type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
            <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
            taskList.appendChild(li);
        });
    }
}

function addTask() {
    const task = document.querySelector("form input");
    const list = document.querySelector("ul");
    // return if task is empty
    if (task.value === "") {
        alert("Please add a task!");
        return false;
    }
    // check is task already exists
    if (document.querySelector(`input[value="${task.value}"]`)) {
        alert("Task already exist!");
        return false;
    }

    // add task to local storage
    localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: task.value, completed: false }]));

    // create list item, add innerHTML and append to ul
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
<input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
<i class="fa fa-trash" onclick="removeTask(this)"></i>`;
    list.insertBefore(li, list.children[0]);
    // clear input
    task.value = "";

    loadTasks(); // Call loadTasks after adding a new task to refresh the list
}
// completed task
function taskComplete(event) {
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    tasks.forEach(task => {
        if (task.task === event.nextElementSibling.value) {
            task.completed = !task.completed;
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.nextElementSibling.classList.toggle("completed");
}

function removeTask(event) {
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    tasks.forEach(task => {
        if (task.task === event.parentNode.children[1].value) {
            // delete task
            tasks.splice(tasks.indexOf(task), 1);
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.parentElement.remove();

    // Check if there are tasks in localStorage
    if (tasks.length === 0) {
        const empty = document.createElement("div");
        empty.innerHTML = `<p>You have no current tasks</p>`;
        const taskListContainer = document.querySelector("#task-list");
        taskListContainer.appendChild(empty);
    }
}

// store current task to track changes
var currentTask = null;

// get current task
function getCurrentTask(event) {
    currentTask = event.value;
}

// edit the task and update local storage
function editTask(event) {
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    // check if task is empty
    if (event.value === "") {
        alert("Task is empty!");
        event.value = currentTask;
        return;
    }
    // task already exist
    tasks.forEach(task => {
        if (task.task === event.value) {
            alert("Task already exists!");
            event.value = currentTask;
            return;
        }
    });
    // update task
    tasks.forEach(task => {
        if (task.task === currentTask) {
            task.task = event.value;
        }
    });
    // update local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}