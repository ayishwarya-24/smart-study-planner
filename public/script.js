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

    fetch("/tasks")
        .then(response => response.json())
        .then(tasks => {

            const taskList = document.getElementById("taskList");

            taskList.innerHTML = "";

            let completed = 0;

            tasks.forEach(task => {

                if (task.completed) {
                    completed++;
                }

                taskList.innerHTML += `
                    <div class="task-card">

                        <h3>${task.subject}</h3>

                        <p>${task.task_name}</p>

                        <p>Deadline: ${task.deadline}</p>

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