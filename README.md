# 🚀 Career Connect

Career Connect is a platform designed to help students explore career opportunities, and connect with potential employers or mentors.

---

## 🔧 Tech Stack

- **Frontend**: HTML/CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Others**: Git, GitHub

---

## 🌟 Features

- Student and Company Registration/Login
- password to login and password is stored in the database but encrypted
- Separate interface for Student and Company 
- Student can view job postings and application status dynamically 
- Company can create job postings and view student details who applied
- REST API with Express.js for registration, login, application status, etc.
- MySQL for data management and trigger execution.
  
---

## 📁 Project Structure

career-connect/

├── company-dashboard.html

├── company-dashboard.js

├── company-login.html

├── company-register.html

├── index.html

├── package.json

├── package-lock.json

├── server.js

├── student-dashboard.html

├── student-dashboard.js

├── student-login.html

├── student-register.html

├── styles.css

└── README.md





---

## 🚀 How to Run the Career Connect Project

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MySQL](https://www.mysql.com/) installed and running

---

### 📦 Step 1: Clone the Repository

```bash
git clone https://github.com/Gawdiee/Career_connect.git
cd Career_connect
```

### ⚙️ **Step 2: Set Up the Environment**

Start your MySQL server.

Login and create a database:
```
CREATE DATABASE career_connect;
```

If required, manually import any .sql schema or tables.

Edit the database credentials inside server.js:
```
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'career_connect'
});
```

### 📁 **Step 3: Install Dependencies**
```
npm install
```
### ▶️ **Step 4: Run the Server**
```
node server.js
```

The server will start at: http://localhost:3000
