const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
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
    password: "Starose24",
    database: "studyplanner"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("Connected to MySQL!");
});

// REGISTER
app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    const hashedPassword =
        await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
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
        "SELECT * FROM users WHERE username=?",
        [username],
        async (err, results) => {

            if (err) throw err;

            if (results.length === 0) {
                return res.send("Invalid Login");
            }

            const match =
                await bcrypt.compare(
                    password,
                    results[0].password
                );

            if (match) {

                req.session.userId =
                    results[0].id;

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
        `INSERT INTO tasks (user_id, subject, task_name, deadline, priority)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, subject, task, deadline, priority],
        (err) => {
            if (err) throw err;

            res.redirect("/index.html");
        }
    );

});

//GET TASKS
app.get("/tasks", (req, res) => {

    console.log("Session userId:", req.session.userId);

    const userId = req.session.userId;

    db.query(
        "SELECT * FROM tasks WHERE user_id = ?",
        [userId],
        (err, results) => {
            if (err) throw err;

            res.json(results);
        }
    );
});

//COMPLETE TASK
app.post("/completeTask/:id", (req, res) => {

    db.query(
        "UPDATE tasks SET completed = TRUE WHERE id = ?",
        [req.params.id],
        (err) => {
            if (err) throw err;

            res.sendStatus(200);
        }
    );
});

//DELETE TASK
app.post("/deleteTask/:id", (req, res) => {

    db.query(
        "DELETE FROM tasks WHERE id = ?",
        [req.params.id],
        (err) => {
            if (err) throw err;

            res.sendStatus(200);
        }
    );
});


//LOGOUT
app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/login.html");
    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
