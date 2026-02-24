-- ============================================
-- SECURITY MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS securitymanagementsystem;
USE securitymanagementsystem;

-- ============================================
-- PHASE 3 – CONSTRAINTS & TABLES CREATION
-- ============================================

-- 1️⃣ Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Role ENUM('Admin', 'Security Analyst', 'User') NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ ThreatLogs Table
CREATE TABLE ThreatLogs (
    ThreatID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    Type VARCHAR(100) NOT NULL,
    Severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    DetectedDate DATE NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- 3️⃣ Incidents Table
CREATE TABLE Incidents (
    IncidentID INT PRIMARY KEY AUTO_INCREMENT,
    ThreatID INT NOT NULL,
    ActionTaken TEXT,
    Status ENUM('Open', 'In Progress', 'Resolved', 'Escalated') NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ThreatID) REFERENCES ThreatLogs(ThreatID) ON DELETE CASCADE
);

-- 4️⃣ Vulnerabilities Table
CREATE TABLE Vulnerabilities (
    VulnerabilityID INT PRIMARY KEY AUTO_INCREMENT,
    Description TEXT NOT NULL,
    PatchAvailable BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5️⃣ SecurityUpdates Table
CREATE TABLE SecurityUpdates (
    UpdateID INT PRIMARY KEY AUTO_INCREMENT,
    VulnerabilityID INT NOT NULL,
    ReleaseDate DATE NOT NULL,
    FOREIGN KEY (VulnerabilityID) REFERENCES Vulnerabilities(VulnerabilityID) ON DELETE CASCADE
);

-- ============================================
-- BUSINESS RULES IMPLEMENTATION
-- ============================================

-- Business Rule 1: Status cannot be "Resolved" if ActionTaken is empty
DELIMITER //
CREATE TRIGGER check_action_taken
BEFORE INSERT ON Incidents
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Resolved' AND (NEW.ActionTaken IS NULL OR NEW.ActionTaken = '') THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Business Rule: Status cannot be "Resolved" if ActionTaken is empty';
    END IF;
END//

CREATE TRIGGER check_action_taken_update
BEFORE UPDATE ON Incidents
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Resolved' AND (NEW.ActionTaken IS NULL OR NEW.ActionTaken = '') THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Business Rule: Status cannot be "Resolved" if ActionTaken is empty';
    END IF;
END//
DELIMITER ;

-- Business Rule 2: If PatchAvailable = TRUE → Must have SecurityUpdate
DELIMITER //
CREATE TRIGGER check_patch_update
BEFORE UPDATE ON Vulnerabilities
FOR EACH ROW
BEGIN
    IF NEW.PatchAvailable = TRUE THEN
        IF NOT EXISTS (
            SELECT 1 FROM SecurityUpdates WHERE VulnerabilityID = NEW.VulnerabilityID
        ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Business Rule: If PatchAvailable = TRUE, must have SecurityUpdate';
        END IF;
    END IF;
END//
DELIMITER ;

-- ============================================
-- PHASE 5 – RELATIONAL SCHEMA
-- ============================================
-- Users(UserID, Name, Email, Role)
-- ThreatLogs(ThreatID, UserID, Type, Severity, DetectedDate)
-- Incidents(IncidentID, ThreatID, ActionTaken, Status, CreatedAt)
-- Vulnerabilities(VulnerabilityID, Description, PatchAvailable, CreatedAt)
-- SecurityUpdates(UpdateID, VulnerabilityID, ReleaseDate)

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

INSERT INTO Users (Name, Email, Role) VALUES 
('Admin User', 'admin@security.com', 'Admin'),
('John Analyst', 'john@security.com', 'Security Analyst'),
('Jane User', 'jane@security.com', 'User');

INSERT INTO ThreatLogs (UserID, Type, Severity, DetectedDate) VALUES 
(1, 'Malware', 'High', '2024-01-15'),
(2, 'Phishing', 'Critical', '2024-01-16'),
(1, 'SQL Injection', 'High', '2024-01-17');

INSERT INTO Incidents (ThreatID, ActionTaken, Status) VALUES 
(1, 'Quarantined infected files', 'Resolved'),
(2, 'Blocked suspicious email', 'In Progress'),
(3, 'Applied input sanitization', 'Open');

INSERT INTO Vulnerabilities (Description, PatchAvailable) VALUES 
('SQL Injection in login form', TRUE),
('XSS vulnerability in comments', FALSE),
('Outdated SSL certificate', TRUE);

INSERT INTO SecurityUpdates (VulnerabilityID, ReleaseDate) VALUES 
(1, '2024-01-20'),
(3, '2024-01-22');

-- ============================================
-- QUERIES FOR TESTING
-- ============================================

-- Get all users
SELECT * FROM Users;

-- Get all threats with user info
SELECT t.ThreatID, t.Type, t.Severity, t.DetectedDate, u.Name as LoggedBy 
FROM ThreatLogs t 
JOIN Users u ON t.UserID = u.UserID;

-- Get all incidents with threat info
SELECT i.IncidentID, i.Status, i.ActionTaken, i.CreatedAt, t.Type as ThreatType, t.Severity
FROM Incidents i
JOIN ThreatLogs t ON i.ThreatID = t.ThreatID;

-- Get vulnerabilities with updates
SELECT v.VulnerabilityID, v.Description, v.PatchAvailable, 
       u.UpdateID, u.ReleaseDate
FROM Vulnerabilities v
LEFT JOIN SecurityUpdates u ON v.VulnerabilityID = u.VulnerabilityID;

