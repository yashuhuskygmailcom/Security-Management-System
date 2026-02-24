const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database Configuration (SQLite)
const dbPath = path.join(__dirname, 'securitymanagementsystem.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('\n❌ Database Connection ERROR:\n');
        console.error('   Message:', err.message);
        process.exit(1);
    } else {
        console.log('\n✅ Connected to SQLite Database:', dbPath, '\n');
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON');
        // Initialize database schema
        initializeDatabase();
    }
});

// Initialize database with tables
function initializeDatabase() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS Users (
            UserID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT NOT NULL,
            Email TEXT UNIQUE NOT NULL,
            Role TEXT CHECK(Role IN ('Admin', 'Security Analyst', 'User')) NOT NULL,
            CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // ThreatLogs Table
        db.run(`CREATE TABLE IF NOT EXISTS ThreatLogs (
            ThreatID INTEGER PRIMARY KEY AUTOINCREMENT,
            UserID INTEGER NOT NULL,
            Type TEXT NOT NULL,
            Severity TEXT CHECK(Severity IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL,
            DetectedDate DATE NOT NULL,
            FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
        )`);

        // Incidents Table
        db.run(`CREATE TABLE IF NOT EXISTS Incidents (
            IncidentID INTEGER PRIMARY KEY AUTOINCREMENT,
            ThreatID INTEGER NOT NULL,
            ActionTaken TEXT,
            Status TEXT CHECK(Status IN ('Open', 'In Progress', 'Resolved', 'Escalated')) NOT NULL,
            CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ThreatID) REFERENCES ThreatLogs(ThreatID) ON DELETE CASCADE
        )`);

        // Vulnerabilities Table
        db.run(`CREATE TABLE IF NOT EXISTS Vulnerabilities (
            VulnerabilityID INTEGER PRIMARY KEY AUTOINCREMENT,
            Description TEXT NOT NULL,
            PatchAvailable BOOLEAN DEFAULT 0,
            CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // SecurityUpdates Table
        db.run(`CREATE TABLE IF NOT EXISTS SecurityUpdates (
            UpdateID INTEGER PRIMARY KEY AUTOINCREMENT,
            VulnerabilityID INTEGER NOT NULL,
            ReleaseDate DATE NOT NULL,
            FOREIGN KEY (VulnerabilityID) REFERENCES Vulnerabilities(VulnerabilityID) ON DELETE CASCADE
        )`, () => {
            // After all tables are created, insert sample data
            insertSampleData();
        });
    });
}

// Insert sample data
function insertSampleData() {
    db.get('SELECT COUNT(*) as count FROM Users', (err, row) => {
        if (err || row.count > 0) return;

        // Insert users first
        db.run(`INSERT INTO Users (Name, Email, Role) VALUES 
            ('Admin User', 'admin@security.com', 'Admin'),
            ('John Analyst', 'john@security.com', 'Security Analyst'),
            ('Jane User', 'jane@security.com', 'User')`, () => {

            // Then insert threats
            db.run(`INSERT INTO ThreatLogs (UserID, Type, Severity, DetectedDate) VALUES 
                (1, 'Malware', 'High', '2024-01-15'),
                (2, 'Phishing', 'Critical', '2024-01-16'),
                (1, 'SQL Injection', 'High', '2024-01-17')`, () => {

                // Then insert incidents
                db.run(`INSERT INTO Incidents (ThreatID, ActionTaken, Status) VALUES 
                    (1, 'Quarantined infected files', 'Resolved'),
                    (2, 'Blocked suspicious email', 'In Progress'),
                    (3, 'Applied input sanitization', 'Open')`, () => {

                    // Then insert vulnerabilities
                    db.run(`INSERT INTO Vulnerabilities (Description, PatchAvailable) VALUES 
                        ('SQL Injection in login form', 1),
                        ('XSS vulnerability in comments', 0),
                        ('Outdated SSL certificate', 1)`, () => {

                        // Finally insert security updates
                        db.run(`INSERT INTO SecurityUpdates (VulnerabilityID, ReleaseDate) VALUES 
                            (1, '2024-01-20'),
                            (3, '2024-01-22')`, () => {
                            console.log('✅ Sample data inserted\n');
                        });
                    });
                });
            });
        });
    });
}

// ============================================
// API ENDPOINTS
// ============================================

// -------------------- USERS API --------------------

// POST /users - Create new user
app.post('/api/users', (req, res) => {
    const { Name, Email, Role } = req.body;
    const sql = 'INSERT INTO Users (Name, Email, Role) VALUES (?, ?, ?)';
    db.run(sql, [Name, Email, Role], (err) => {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User created successfully', userId: this.lastID });
    });
});

// GET /users - Get all users
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM Users ORDER BY UserID DESC';
    db.all(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET /users/:id - Get single user
app.get('/api/users/:id', (req, res) => {
    const sql = 'SELECT * FROM Users WHERE UserID = ?';
    db.get(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// DELETE /users/:id - Delete user
app.delete('/api/users/:id', (req, res) => {
    const sql = 'DELETE FROM Users WHERE UserID = ?';
    db.run(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User deleted successfully' });
    });
});

// -------------------- THREAT LOGS API --------------------

// POST /threats - Create new threat
app.post('/api/threats', (req, res) => {
    const { UserID, Type, Severity, DetectedDate } = req.body;
    const sql = 'INSERT INTO ThreatLogs (UserID, Type, Severity, DetectedDate) VALUES (?, ?, ?, ?)';
    db.run(sql, [UserID, Type, Severity, DetectedDate], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Threat logged successfully', threatId: this.lastID });
    });
});

// GET /threats - Get all threats
app.get('/api/threats', (req, res) => {
    const { severity } = req.query;
    let sql = `
        SELECT t.ThreatID, t.Type, t.Severity, t.DetectedDate, u.Name as UserName, u.UserID
        FROM ThreatLogs t 
        JOIN Users u ON t.UserID = u.UserID
    `;
    
    if (severity && severity !== 'All') {
        sql += ' WHERE t.Severity = ? ORDER BY t.ThreatID DESC';
        db.all(sql, [severity], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    } else {
        sql += ' ORDER BY t.ThreatID DESC';
        db.all(sql, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
});

// GET /threats/:id - Get single threat
app.get('/api/threats/:id', (req, res) => {
    const sql = 'SELECT * FROM ThreatLogs WHERE ThreatID = ?';
    db.get(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// DELETE /threats/:id - Delete threat
app.delete('/api/threats/:id', (req, res) => {
    const sql = 'DELETE FROM ThreatLogs WHERE ThreatID = ?';
    db.run(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Threat deleted successfully' });
    });
});

// -------------------- INCIDENTS API --------------------

// POST /incidents - Create new incident
app.post('/api/incidents', (req, res) => {
    const { ThreatID, ActionTaken, Status } = req.body;
    const sql = 'INSERT INTO Incidents (ThreatID, ActionTaken, Status) VALUES (?, ?, ?)';
    db.run(sql, [ThreatID, ActionTaken, Status], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Incident created successfully', incidentId: this.lastID });
    });
});

// GET /incidents - Get all incidents
app.get('/api/incidents', (req, res) => {
    const sql = `
        SELECT i.IncidentID, i.ThreatID, i.ActionTaken, i.Status, i.CreatedAt,
               t.Type as ThreatType, t.Severity
        FROM Incidents i
        JOIN ThreatLogs t ON i.ThreatID = t.ThreatID
        ORDER BY i.IncidentID DESC
    `;
    db.all(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// PUT /incidents/:id - Update incident
app.put('/api/incidents/:id', (req, res) => {
    const { ActionTaken, Status } = req.body;
    const sql = 'UPDATE Incidents SET ActionTaken = ?, Status = ? WHERE IncidentID = ?';
    db.run(sql, [ActionTaken, Status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Incident updated successfully' });
    });
});

// GET /incidents/:id - Get single incident
app.get('/api/incidents/:id', (req, res) => {
    const sql = 'SELECT * FROM Incidents WHERE IncidentID = ?';
    db.get(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// DELETE /incidents/:id - Delete incident
app.delete('/api/incidents/:id', (req, res) => {
    const sql = 'DELETE FROM Incidents WHERE IncidentID = ?';
    db.run(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Incident deleted successfully' });
    });
});

// -------------------- VULNERABILITIES API --------------------

// POST /vulnerabilities - Create new vulnerability
app.post('/api/vulnerabilities', (req, res) => {
    const { Description, PatchAvailable } = req.body;
    const sql = 'INSERT INTO Vulnerabilities (Description, PatchAvailable) VALUES (?, ?)';
    db.run(sql, [Description, PatchAvailable ? 1 : 0], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Vulnerability created successfully', vulnerabilityId: this.lastID });
    });
});

// GET /vulnerabilities - Get all vulnerabilities
app.get('/api/vulnerabilities', (req, res) => {
    const sql = 'SELECT * FROM Vulnerabilities ORDER BY VulnerabilityID DESC';
    db.all(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        // Convert boolean to proper format
        const formatted = results.map(v => ({
            ...v,
            PatchAvailable: Boolean(v.PatchAvailable)
        }));
        res.json(formatted);
    });
});

// DELETE /vulnerabilities/:id - Delete vulnerability
app.delete('/api/vulnerabilities/:id', (req, res) => {
    const sql = 'DELETE FROM Vulnerabilities WHERE VulnerabilityID = ?';
    db.run(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Vulnerability deleted successfully' });
    });
});

// -------------------- SECURITY UPDATES API --------------------

// POST /updates - Create new security update
app.post('/api/updates', (req, res) => {
    const { VulnerabilityID, ReleaseDate } = req.body;
    const sql = 'INSERT INTO SecurityUpdates (VulnerabilityID, ReleaseDate) VALUES (?, ?)';
    db.run(sql, [VulnerabilityID, ReleaseDate], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Security update created successfully', updateId: this.lastID });
    });
});

// GET /updates - Get all security updates
app.get('/api/updates', (req, res) => {
    const sql = `
        SELECT u.UpdateID, u.VulnerabilityID, u.ReleaseDate,
               v.Description as VulnerabilityDescription
        FROM SecurityUpdates u
        JOIN Vulnerabilities v ON u.VulnerabilityID = v.VulnerabilityID
        ORDER BY u.UpdateID DESC
    `;
    db.all(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET /updates/vulnerability/:id - Get updates for specific vulnerability
app.get('/api/updates/vulnerability/:id', (req, res) => {
    const sql = 'SELECT * FROM SecurityUpdates WHERE VulnerabilityID = ?';
    db.all(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// DELETE /updates/:id - Delete security update
app.delete('/api/updates/:id', (req, res) => {
    const sql = 'DELETE FROM SecurityUpdates WHERE UpdateID = ?';
    db.run(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Security update deleted successfully' });
    });
});

// -------------------- LOGIN API --------------------

// POST /api/login - User login
app.post('/api/login', (req, res) => {
    const { Email, Role } = req.body;
    const sql = 'SELECT * FROM Users WHERE Email = ? AND Role = ?';
    db.get(sql, [Email, Role], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!result) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ 
            message: 'Login successful', 
            user: result,
            redirect: getRedirectPage(result.Role)
        });
    });
});

function getRedirectPage(role) {
    switch(role) {
        case 'Admin': return 'users.html';
        case 'Security Analyst': return 'threats.html';
        case 'User': return 'vulnerabilities.html';
        default: return 'index.html';
    }
}

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}\n`);
    console.log('📊 Database: SQLite (securitymanagementsystem.db)');
    console.log('🔐 Login with: admin@security.com, john@security.com, or jane@security.com\n');
});

