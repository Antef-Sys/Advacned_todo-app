// SELECT ELEMENTS
const input = document.querySelector(".add-task input");
const addBtn = document.querySelector(".addbtn");
const taskList = document.querySelector(".task-list");
const clearBtn = document.querySelector(".clear-btn");
const filterButtons = document.querySelectorAll(".filters-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


// SAVE TASKS
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// RENDER TASKS
function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        // FILTER LOGIC
        if (
            (currentFilter === "completed" && !task.completed) ||
            (currentFilter === "pending" && task.completed)
        ) {
            return;
        }

        const li = document.createElement("li");
        li.classList.add("task-item");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
        <div class="task-left">
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <span class="task-text">${task.text}</span>
        </div>

        <div class="task-actions">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
        `;


        // TOGGLE COMPLETE
        li.querySelector("input").addEventListener("change", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });


        // DELETE TASK
        li.querySelector(".delete").addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });


        // EDIT TASK
        li.querySelector(".edit").addEventListener("click", () => {

            const span = li.querySelector(".task-text");
            const currentText = span.textContent;

            const editInput = document.createElement("input");
            editInput.value = currentText;
            editInput.classList.add("edit-input");

            span.replaceWith(editInput);
            editInput.focus();

            // SAVE ON ENTER
            editInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    tasks[index].text = editInput.value;
                    saveTasks();
                    renderTasks();
                }
            });

            // SAVE ON BLUR
            editInput.addEventListener("blur", () => {
                tasks[index].text = editInput.value;
                saveTasks();
                renderTasks();
            });

        });

        taskList.appendChild(li);

    });

}


// ADD TASK
addBtn.addEventListener("click", () => {

    const text = input.value.trim();

    if (text === "") return;

    tasks.push({
        text: text,
        completed: false
    });

    input.value = "";

    saveTasks();
    renderTasks();

});


// ADD TASK WITH ENTER KEY
input.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        addBtn.click();
    }

});


// CLEAR COMPLETED TASKS
clearBtn.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();

});


// FILTER BUTTONS
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.textContent.toLowerCase();

        renderTasks();

    });

});


// INITIAL LOAD
renderTasks();