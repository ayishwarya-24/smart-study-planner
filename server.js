const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "studyplanner",
    resave: false,
    saveUninitialized: true
}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "YOUR_PASSWORD",
    database: "studyplanner"
});

// REGISTER
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (err) => {
            if (err) throw err;

            res.redirect("/login.html");
        }
    );
});

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                req.session.userId = results[0].id;

                res.redirect("/index.html");
            } else {
                res.send("Invalid Login");
            }
        }
    );
});

// ADD TASK
app.post("/addTask", (req, res) => {
    const { subject, task, deadline, priority } = req.body;

    const userId = req.session.userId;

    db.query(
        `INSERT INTO tasks (user_id, subject, task, deadline, priority)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, subject, task, deadline, priority],
        (err) => {
            if (err) throw err;

            res.redirect("/index.html");
        }
    );

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
