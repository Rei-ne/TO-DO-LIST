function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
};

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

window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");
    const dish_el = document.querySelector("#previouss");

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;

        if (!task) {
            alert("Please fill out the task");
            return;
        }

        const task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        // task_content_el.innerText = task;

        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = task;
        task_input_el.setAttribute("readonly","readonly");

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Edit";

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerHTML = "Delete";

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        input.value = "";

        task_edit_el.addEventListener('click', () => {
            if (task_edit_el.innerText.toLowerCase() === "edit") {
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
                task_edit_el.innerText = "Save";
            }
            else {
                task_input_el.setAttribute("readonly","readonly");
                task_edit_el.innerText = "Edit";

            }
        });

        task_delete_el.addEventListener('click', () => {
            list_el.removeChild(task_el);
        });
    });
/* 0xgrowth decided to add the possibility of storing tasks so that even after 
refreshing the page the user can access previous tasks */

const buttoon = document.querySelector("#new-task-save");

buttoon.onclick = function() {

    // const task = input.value;
    // THIS IS WHERE IT GETS TRICKY YOU KNOW, I NEED TO DEFINE WHAT GETS STORED HERE.
    
            let oldd = [];
            let oldTask = {
                id: todaysDate,
                tasks: task
            } 
        oldd.push(oldTask);
// console.warn ('added', {oldd});
        localStorage.setItem('preTasks', JSON.stringify(oldd));

/*I love this JS*/

const fish_el = document.createElement("button");
fish_el.classList.add("dishes");
fish_el.innerHTML = "Display Previous Tasks";

/* This if else statement prevents the 'display previous tasks button from
 popping up multiple times whenever the 'save task button is clicked */

if ( dish_el.hasChildNodes() === true ) {
    console.log(' ');
} else {
    dish_el.appendChild(fish_el);
}

fish_el.addEventListener('click', (b) => {
    b.preventDefault();

    const bed = document.createElement("div");
    bed.classList.add("previous");
    let c = localStorage.getItem('preTasks', JSON.stringify(oldd));
    bed.innerHTML = c;

    dish_el.appendChild(bed);

    const aish_el = document.createElement("button");
    aish_el.classList.add("hider");
    aish_el.innerHTML = "Hide Previous Tasks";    

    dish_el.appendChild(aish_el);
    });

   }
});