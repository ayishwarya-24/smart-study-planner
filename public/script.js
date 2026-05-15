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