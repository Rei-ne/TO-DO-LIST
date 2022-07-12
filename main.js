function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
};


/* 0xgrowth decided to add the possibility of storing tasks so that even after 
refreshing the page the user can access previous tasks */
/* The date */
const date = document.querySelector(".date");
const dater = new Date(),
    dayOfMonth = dater.getDate(),
    year = dater.getFullYear(),
    months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
    monthOfYear = months[dater.getMonth()],
    todaysDate = "Day" + " " + dayOfMonth + ", " + monthOfYear + ", " + year;
date.textContent = todaysDate;

// const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const tasker = document.querySelector(".tasks");
const filter = document.querySelectorAll(".filters span");
const clearList = document.querySelector(".clear");
let ToDo = JSON.parse(localStorage.getItem("todoList"));
let edited = false;
let editId;

input.addEventListener("keyup", (entry) => {
    let userTask = input.value.trim();
    if (entry.key === "Enter" && userTask) {
        if (!edited) {
            // if task is not being edited (not false ie true[edited])
            if (!ToDo) {
                // if todo is not empty
                ToDo = []; // set localStorage (if list is cleared) to an empty array
            }
            let taskInfo = {
                name: userTask,
                status: "pending"
            };
            ToDo.push(taskInfo); // add new task to localStorage
        } else {
            ToDo[editId].name = userTask;
            edited = false;
        }
        input.value = ""; // important line
        localStorage.setItem("todoList", JSON.stringify(ToDo));
        viewTasks("all");
    }
});

const viewTasks = (filters) => {
    let li = "";
    if (ToDo) {
        ToDo.forEach((task, id) => {
            let finished = task.status == "complete" ? "marked" : ""; // keep line through text on refresh
            let check = task.status == "complete" ? "checked" : ""; // keep checkbox checked on refresh
            if (filters == task.status || filters == "all") {
                li += `<li class="task">
                        <label for="${id}">
                            <input onclick="finishTask(this)" type="checkbox" id="${id}" ${check}>
                                <p class="${finished}">${task.name}</p>
                        </label>
                        <div class="options">
                            <i onclick="taskMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="optMenu">
                                <li onclick="editTask(${id}, '${task.name}')"><i class="uil uil-edit-alt"></i>Edit</li>
                                <li onclick="deleteTask(${id})"><i class="uil uil-minus-circle"></i>Delete</li>
                            </ul>
                        </div>
                    </li>`;
            }
        });
    }
// line 73 to line 76 is for the checkbox in front of each task.
// line 77 for Edit and Delete options
    tasker.innerHTML =
        li ||
        `<p style="text-transform: uppercase;">you do not have any task here</p>`;
};
viewTasks("all");

const finishTask = (checkedTask) => {
    let taskName = checkedTask.parentElement.lastElementChild; // getting the <p> element from front end
    if (checkedTask.checked) {
        // user checks task
        taskName.classList.add("marked");
        ToDo[checkedTask.id].status = "complete";
    } else {
        // user unchecks task
        taskName.classList.remove("marked");
        ToDo[checkedTask.id].status = "pending";
    }
    localStorage.setItem("todoList", JSON.stringify(ToDo)); // update localStorage
};

// user wants to view options either to edit or delete task
const taskMenu = (selectedTask) => {
    let options = selectedTask.parentElement.lastElementChild; // getting the <i> element from <div> parent element
    options.classList.add("show");
    document.addEventListener("click", (elsewhere) => {
        if (elsewhere.target.tagName != "I" || elsewhere.target != selectedTask) {
            options.classList.remove("show");
        }
    });
};

// user wants to edit task
const editTask = (taskId, taskName) => {
    editId = taskId;
    edited = true;
    input.value = taskName;
};

// user wants to delete task
const deleteTask = (selectedTask) => {
    ToDo.splice(selectedTask, 1);
    localStorage.setItem("todoList", JSON.stringify(ToDo)); // update localStorage
    viewTasks("all");
};

// filter unfinished and completed tasks
filter.forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        button.classList.add("active");
        viewTasks(button.id);
    });
});

// user wants to clear todo list
clearList.addEventListener("click", () => {
    ToDo.splice(0, ToDo.length);
    localStorage.setItem("todoList", JSON.stringify(ToDo)); // update localStorage
    viewTasks();
});
// input.addEventListener('submit', (e) => {
//         e.preventDefault();

//         let task = input.value;

//         if (!task) {
//             alert("Please fill out the task");
//             return;
//         }
       
//         const task_el = document.createElement("div");
//         task_el.classList.add("task");

//         const task_content_el = document.createElement("div");
//         task_content_el.classList.add("content");

//         // task_content_el.innerText = task;

//         task_el.appendChild(task_content_el);

//         const task_input_el = document.createElement("input");
//         task_input_el.classList.add("text");
//         task_input_el.type = "text";
//         task_input_el.value = task;
//         task_input_el.setAttribute("readonly","readonly");

//         task_content_el.appendChild(task_input_el);

//         const task_actions_el = document.createElement("div");
//         task_actions_el.classList.add("actions");

//         const task_edit_el = document.createElement("button");
//         task_edit_el.classList.add("edit");
//         task_edit_el.innerHTML = "Edit";

//         const task_delete_el = document.createElement("button");
//         task_delete_el.classList.add("delete");
//         task_delete_el.innerHTML = "Delete";

//         task_actions_el.appendChild(task_edit_el);
//         task_actions_el.appendChild(task_delete_el);

//         task_el.appendChild(task_actions_el);

//         list_el.appendChild(task_el);

//         input.value = "";

//         if (SaData) {
//             let SaData = [];  
//             let userTask = task.trim();
//             let taskInfo = {
//                 name: userTask
//                     }
//                     console.log(SaData);
//                     console.log(SaData.type);

//             SaData.push(taskInfo);
//             localStorage.setItem("todoList", JSON.stringify(taskInfo)); 
//     }
       
//         task_edit_el.addEventListener('click', () => {
//             if (task_edit_el.innerText.toLowerCase() === "edit") {
//                 task_input_el.removeAttribute("readonly");
//                 task_input_el.focus();
//                 task_edit_el.innerText = "Save";
//             }
//             else {
//                 task_input_el.setAttribute("readonly","readonly");
//                 task_edit_el.innerText = "Edit";

//             }
//         });

//         task_delete_el.addEventListener('click', () => {
//             list_el.removeChild(task_el);
//         });
//     });