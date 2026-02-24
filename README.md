# Security Management System

## 📋 Project Overview

A comprehensive Security Management System built with Node.js, MySQL, and vanilla HTML/CSS/JS. This system helps security teams manage users, threat logs, incidents, vulnerabilities, and security updates.

---

## 🗄️ Database Design

### Phase 3 – Constraints

#### Primary Keys
- All ID fields (UserID, ThreatID, IncidentID, VulnerabilityID, UpdateID)

#### Foreign Keys
- ThreatLogs → Users (UserID)
- Incidents → ThreatLogs (ThreatID)
- SecurityUpdates → Vulnerabilities (VulnerabilityID)

#### ENUM Constraints
- **Role**: Admin, Security Analyst, User
- **Severity**: Low, Medium, High, Critical
- **Status**: Open, In Progress, Resolved, Escalated

#### Business Rules
1. Status cannot be "Resolved" if ActionTaken is empty
2. If PatchAvailable = TRUE → Must have SecurityUpdate

---

### Phase 5 – Relational Schema

```
Users(UserID, Name, Email, Role)
ThreatLogs(ThreatID, UserID, Type, Severity, DetectedDate)
Incidents(IncidentID, ThreatID, ActionTaken, Status, CreatedAt)
Vulnerabilities(VulnerabilityID, Description, PatchAvailable, CreatedAt)
SecurityUpdates(UpdateID, VulnerabilityID, ReleaseDate)
```

---

## 🎯 Features

### ✅ Complete Functionality
- **User Management**: Create and manage users with different roles (Admin, Security Analyst, User)
- **Threat Logging**: Log and track security threats with severity levels
- **Incident Management**: Create and manage incidents related to threats
- **Vulnerability Tracking**: Maintain a database of system vulnerabilities
- **Security Updates**: Track patches and updates for vulnerabilities
- **Role-Based Dashboard**: Different views for different user roles
- **Real-time Statistics**: Live stats showing counts and distributions
- **Advanced Filtering**: Filter threats by severity, incidents by status
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Business Rule Validation**: Database-level triggers for data integrity
- **Session-Based Authentication**: Secure user sessions

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14 or higher
- **MySQL** v5.7 or higher
- **npm**

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Database (Choose one method)

**Method A: Automatic Setup (Recommended)**
```bash
chmod +x setup.sh
./setup.sh
```

**Method B: Manual Setup**
1. Start MySQL:
   ```bash
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

2. Create database:
   ```bash
   mysql -u root -p < database.sql
   ```

3. Create/Update `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=securitymanagementsystem
   PORT=3000
   ```

### Step 3: Start the Application
```bash
npm start
```

The application will be available at **http://localhost:3000**

---

## 📋 Default Login Credentials

| Email | Role | Password |
|-------|------|----------|
| admin@security.com | Admin | (just select role) |
| john@security.com | Security Analyst | (just select role) |
| jane@security.com | User | (just select role) |

*Note: This system uses role-based authentication without passwords. Simply select the correct role.*

---

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- npm

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup MySQL Database**
   ```bash
   mysql -u root -p < database.sql
   ```
   
   Or import `database.sql` through MySQL Workbench/phpmyadmin.

3. **Configure Database Connection**
   Edit `server.js` and update the database credentials:
   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: 'your_password',
       database: 'securitymanagementsystem'
   });
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Access the Application**
   Open: http://localhost:3000

---

## 👤 Demo Credentials

| Role | Email | Password (any) |
|------|-------|----------------|
| Admin | admin@security.com | - |
| Security Analyst | john@security.com | - |
| User | jane@security.com | - |

---

## 🌐 Frontend Modules

1. **Login Page** - Role-based login
2. **Users Management** - Add/View/Delete users
3. **Threat Logs** - Add/View threats with severity filtering
4. **Incidents** - Create/Edit incidents with status tracking
5. **Vulnerabilities** - Add/View/Delete vulnerabilities
6. **Security Updates** - Add patches linked to vulnerabilities

---

## 📡 Backend API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `DELETE /api/users/:id` - Delete user

### Threats
- `POST /api/threats` - Log threat
- `GET /api/threats` - Get all threats
- `GET /api/threats?severity=High` - Filter by severity

### Incidents
- `POST /api/incidents` - Create incident
- `GET /api/incidents` - Get all incidents
- `PUT /api/incidents/:id` - Update incident

### Vulnerabilities
- `POST /api/vulnerabilities` - Add vulnerability
- `GET /api/vulnerabilities` - Get all vulnerabilities
- `DELETE /api/vulnerabilities/:id` - Delete vulnerability

### Security Updates
- `POST /api/updates` - Add security update
- `GET /api/updates` - Get all updates

### Authentication
- `POST /api/login` - User login

---

## 📁 Project Structure

```
dbms-mini-project/
├── package.json
├── server.js
├── database.sql
├── ERD.svg
├── README.md
└── public/
    ├── index.html (Login)
    ├── users.html
    ├── threats.html
    ├── incidents.html
    ├── vulnerabilities.html
    ├── updates.html
    ├── css/
    │   └── styles.css
    └── js/
        └── main.js
```

---

## 🔒 Business Rules Implementation

The database implements business rules using triggers:

1. **ActionTaken Check**: Prevents setting status to "Resolved" without ActionTaken
2. **Patch Update Check**: Ensures vulnerabilities with patches have security updates

---

## 📊 ER Diagram

The ER Diagram shows:
- **5 Entities**: Users, ThreatLogs, Incidents, Vulnerabilities, SecurityUpdates
- **Relationships**: 1:N between entities
- **Primary Keys**: All ID fields
- **Foreign Keys**: As defined in the schema

View `ERD.svg` for the visual diagram.

---

## ✅ Features

- Role-based access control
- Real-time dashboard statistics
- Filter threats by severity
- Track incident status
- Manage vulnerabilities and patches
- Business rule validation
- Responsive design

---

## 📝 License

This project is for educational purposes.

