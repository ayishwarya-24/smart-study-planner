# Smart Study Planner
A full-stack web application that helps students manage study tasks, deadlines, and study schedules.

## Features
- User Registration
- User Login & Logout
- Add Tasks
- Complete Tasks
- Delete Tasks
- Search Tasks
- Dashboard Statistics
- Upcoming Deadlines
- Dark Mode
- Notifications
- Weeekly Timetable


## Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MySQL

## Installation 

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-study-planner.git
cd smart-study-planner
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create the Database

Open MySQL and run:

```sql
CREATE DATABASE studyplanner;
```

### 4. Create Required Tables

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject VARCHAR(100),
    task_name VARCHAR(255),
    deadline DATE,
    priority VARCHAR(20),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```


### 5. Configure Database Connection

Open `server.js` and update:

```javascript
const db = mysql.createConnection({
    host: "localhost",
    user: "YOUR_USERNAME",
    password: "YOUR_PASSWORD",
    database: "studyplanner"
});
```


### 6. Start the Application

```bash
npm start
```

### 7. Open in Browser

Visit:

```
http://localhost:3000
```


  
