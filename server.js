// Import necessary modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sudeep1206',
    database: 'career_connect'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Endpoint for student registration
app.post('/register', async (req, res) => {
    const { name, email, phone, skills, username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO Student (Name, Phone_no, Email, Skills, Username, Password) VALUES (?, ?, ?, ?, ?, ?)';
        connection.execute(query, [name, phone, email, skills, username, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error registering student' });
            }
            res.status(200).json({ message: 'Student registered successfully!' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error hashing password' });
    }
});

// Endpoint for company registration
app.post('/company-register', async (req, res) => {
    const { name, email, location, industry, username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO Company (Name, Location, Industry, Username, Password) VALUES (?, ?, ?, ?, ?)';
        connection.execute(query, [name, location, industry, username, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error registering company' });
            }
            res.status(200).json({ message: 'Company registered successfully!' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error hashing password' });
    }
});

// Endpoint for student login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM Student WHERE Username = ?';
    connection.execute(query, [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Username not found' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.Password);

        if (isMatch) {
            res.status(200).json({
                success: true,
                message: 'Login successful!',
                student_id: user.Stud_id,
                student_name: user.Name
            });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    });
});

// Endpoint for company login
app.post('/company-login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM Company WHERE Username = ?';
    connection.execute(query, [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Username not found' });
        }

        const company = results[0];
        const isMatch = await bcrypt.compare(password, company.Password);

        if (isMatch) {
            res.status(200).json({
                success: true,
                message: 'Login successful!',
                comp_id: company.Comp_id,
                company_name: company.Name
            });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    });
});


// Endpoint for posting a new job
app.post('/post-job', (req, res) => {
    const { title, role, eligibility, comp_id } = req.body;
    
    const query = 'INSERT INTO jobposting (Title, Role, Eligibility, Comp_id) VALUES (?, ?, ?, ?)';
    
    connection.execute(query, [title, role, eligibility, comp_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error posting job' });
        }
        res.status(200).json({ message: 'Job posted successfully!' });
    });
});

// Endpoint to get job postings the student has not applied to
app.get('/job-posting/:studId', (req, res) => {
    const studId = req.params.studId;

    const query = `
        SELECT jp.Job_id, jp.Title, jp.Role, jp.Eligibility, c.Name AS CompanyName
        FROM jobposting jp
        JOIN company c ON jp.Comp_id = c.Comp_id
        LEFT JOIN application a ON jp.Job_id = a.Job_id AND a.Stud_id = ?
        WHERE a.Job_id IS NULL
    `;

    connection.execute(query, [studId], (error, results) => {
        if (error) {
            console.error("Error fetching job postings:", error);
            res.status(500).json({ message: 'Error fetching job postings' });
        } else {
            res.json(results);
        }
    });
});


// Endpoint for student to apply for a job
app.post('/apply', (req, res) => {
    const { stud_id, job_id } = req.body;
    const query = `INSERT INTO application (Date_submitted, Status, Stud_id, Job_id) VALUES (NOW(), 'Pending', ?, ?)`;

    connection.execute(query, [stud_id, job_id], (err, result) => {
        if (err) {
            console.error("Error applying for job:", err);
            res.status(500).json({ message: 'Error applying for job' });
        } else {
            res.status(200).json({ message: 'Application submitted successfully!' });
        }
    });
});

// Endpoint to get applications for a specific student
app.get('/student-applications/:studId', (req, res) => {
    const studId = req.params.studId;

    const query = `
        SELECT j.Name AS CompanyName, jp.Title AS JobTitle, a.Status
        FROM application a
        JOIN jobposting jp ON a.Job_id = jp.Job_id
        JOIN company j ON jp.Comp_id = j.Comp_id
        WHERE a.Stud_id = ?
    `;

    connection.execute(query, [studId], (error, results) => {
        if (error) {
            console.error("Error fetching applications:", error);
            res.status(500).json({ message: 'Failed to fetch applications' });
        } else {
            res.json(results);
        }
    });
});

// Endpoint to get applications with student name, skills, job title, and decision status
app.get('/company-applications/:compId', (req, res) => {
    const compId = req.params.compId;

    const query = `
        SELECT a.Appl_id, s.Name AS StudentName, s.Skills, jp.Title AS JobTitle, a.Decision
        FROM application a
        JOIN Student s ON a.Stud_id = s.Stud_id
        JOIN jobposting jp ON a.Job_id = jp.Job_id
        WHERE jp.Comp_id = ? AND a.Decision = 'Pending'
    `;

    connection.execute(query, [compId], (error, results) => {
        if (error) {
            console.error("Error fetching applications:", error);
            res.status(500).json({ message: 'Failed to fetch applications' });
        } else {
            res.json(results);
        }
    });
});



// Endpoint for accepting an application
app.post('/application/accept', (req, res) => {
    const { appl_id } = req.body;

    // Call the stored procedure to update the application decision
    const query = 'CALL UpdateApplicationDecision(?, "Accept")';
    connection.execute(query, [appl_id], (err, results) => {
        if (err) {
            console.error("Error updating application:", err);
            res.status(500).json({ message: 'Error updating application decision' });
        } else {
            const message = results[0][0].message; // Retrieve the message from the procedure result
            if (message.includes("successfully")) {
                res.status(200).json({ message: 'Application accepted' });
            } else {
                res.status(400).json({ message: 'Application has already been decided' });
            }
        }
    });
});


// Endpoint for rejecting an application
app.post('/application/reject', (req, res) => {
    const { appl_id } = req.body;

    // Call the stored procedure to update the application decision
    const query = 'CALL UpdateApplicationDecision(?, "Reject")';
    connection.execute(query, [appl_id], (err, results) => {
        if (err) {
            console.error("Error updating application:", err);
            res.status(500).json({ message: 'Error updating application decision' });
        } else {
            const message = results[0][0].message; // Retrieve the message from the procedure result
            if (message.includes("successfully")) {
                res.status(200).json({ message: 'Application rejected' });
            } else {
                res.status(400).json({ message: 'Application has already been decided' });
            }
        }
    });
});




// Server setup
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
