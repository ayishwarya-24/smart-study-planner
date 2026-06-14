if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function showNotification() {
    if (Notification.permission === "granted") {
        new Notification("Study Reminder", {
            body: "Don't forget today's study tasks!"
        });
    }
}

setTimeout(showNotification, 5000);

        
function loadTasks() {
    console.log("Loading tasks...");

    fetch("/tasks")
        .then(response => response.json())
        .then(tasks => {

            console.log(tasks);

            const taskList = document.getElementById("taskList");

            taskList.innerHTML = "";
            const days = [      
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ];

            days.forEach(day => {
                document.getElementById(day).innerHTML = "";
            });

            const dueSoon = document.getElementById("dueSoon");

            dueSoon.innerHTML = "";

            let completed = 0;

            tasks.forEach(task => {
                const deadlineDate = new Date(task.deadline);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (deadlineDate >= today) {

                    const dayName = days[deadlineDate.getDay()];

                    document.getElementById(dayName).innerHTML +=
                        `• ${task.task_name}<br>`;
                }

                const diffDays = Math.ceil(
                    (deadlineDate - today) /
                    (1000 * 60 * 60 * 24)
                );
                if (diffDays >= 0 && diffDays <= 3 && !task.completed) {
                    dueSoon.innerHTML += `
                        <div class="due-card">
                           ⚠ <strong>${task.subject}</strong><br>
                           ${task.task_name}<br>
                           ${diffDays} day(s) remaining
                        </div>
                    `;
                }

                if (task.completed) {
                    completed++;
                }

                taskList.innerHTML += `
                    <div class="task-card">

                        <h3>${task.subject}</h3>

                        <p>${task.task_name}</p>

                        <p>Deadline: ${task.deadline.split("T")[0]}</p>

                        <p>Priority: ${task.priority}</p>

                        <p>
                            Status:
                            ${task.completed ? "✅ Completed" : "⏳ Pending"}
                        </p>

                        <button onclick="completeTask(${task.id})">
                            Complete
                        </button>

                        <button onclick="deleteTask(${task.id})">
                            Delete
                        </button>

                    </div>
                `;
            });

            if (dueSoon.innerHTML === "") {
                dueSoon.innerHTML = `
                   <div class="due-card">
                    🎉 No upcoming deadlines.
                   </div>
                `;
            }

            document.getElementById("totalTasks").innerText =
                tasks.length;

            document.getElementById("completedTasks").innerText =
                completed;

            document.getElementById("pendingTasks").innerText =
                tasks.length - completed;
        });
}


function completeTask(id) {

    fetch(`/completeTask/${id}`, {
        method: "POST"
    })
    .then(() => loadTasks());
}

function deleteTask(id) {

    fetch(`/deleteTask/${id}`, {
        method: "POST"
    })
    .then(() => loadTasks());
}

loadTasks();

function searchTasks() {

    const input =
        document.getElementById("searchTask")
        .value
        .toLowerCase();

    const cards =
        document.getElementsByClassName("task-card");

    for (let card of cards) {

        if (
            card.innerText
                .toLowerCase()
                .includes(input)
        ) {
            card.style.display = "";
        }
        else {
            card.style.display = "none";
        }
    }
}

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark-mode"
    );
}