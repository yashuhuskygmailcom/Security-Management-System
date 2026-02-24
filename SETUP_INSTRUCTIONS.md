# Security Management System - Setup Guide

## Quick Start

This is a complete, fully functional Security Management System with Node.js backend and MySQL database.

### Prerequisites
- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **npm**

### Installation Steps

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Set Up Database Configuration

Create a `.env` file in the project root (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your MySQL configuration:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=securitymanagementsystem
PORT=3000
```

#### 3. Create Database and Tables

You have two options:

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p < database.sql
```

**Option B: Using MySQL Workbench or phpMyAdmin**
1. Copy the contents of `database.sql`
2. Paste it into your MySQL client
3. Execute the script

#### 4. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### Default Login Credentials

You can log in with these pre-seeded accounts:

| Email | Role | Password |
|-------|------|----------|
| admin@security.com | Admin | (see note) |
| john@security.com | Security Analyst | (see note) |
| jane@security.com | User | (see note) |

**Note:** This system uses simple email-based authentication without passwords. Just select the corresponding role when logging in.

### Application Features

#### For Admins
- 👥 **Users Management**: Create, view, and delete users
- ⚠️ **Threat Logs**: Monitor all threats logged in the system
- 🚨 **Incidents**: View all incidents related to threats
- 🔓 **Vulnerabilities**: Manage system vulnerabilities
- 🔧 **Security Updates**: Track security patches

#### For Security Analysts
- ⚠️ **Threat Logs**: Create new threat logs and filter by severity
- 🚨 **Incidents**: Create and manage incidents
- 🔓 **Vulnerabilities**: View vulnerabilities
- 🔧 **Updates**: View security updates

#### For Regular Users
- 🔓 **Vulnerabilities**: View available vulnerabilities
- 🔧 **Updates**: View security updates

### API Endpoints

#### Users
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `DELETE /api/users/:id` - Delete user

#### Threats
- `POST /api/threats` - Log a threat
- `GET /api/threats` - Get all threats (supports severity filter)
- `GET /api/threats/:id` - Get specific threat
- `DELETE /api/threats/:id` - Delete threat

#### Incidents
- `POST /api/incidents` - Create incident
- `GET /api/incidents` - Get all incidents
- `PUT /api/incidents/:id` - Update incident
- `GET /api/incidents/:id` - Get specific incident
- `DELETE /api/incidents/:id` - Delete incident

#### Vulnerabilities
- `POST /api/vulnerabilities` - Add vulnerability
- `GET /api/vulnerabilities` - Get all vulnerabilities
- `DELETE /api/vulnerabilities/:id` - Delete vulnerability

#### Security Updates
- `POST /api/updates` - Create security update
- `GET /api/updates` - Get all updates
- `GET /api/updates/vulnerability/:id` - Get updates for specific vulnerability
- `DELETE /api/updates/:id` - Delete update

#### Authentication
- `POST /api/login` - User login

### Database Schema

The system uses 5 main tables:

1. **Users** - System users with roles (Admin, Security Analyst, User)
2. **ThreatLogs** - Records of detected threats
3. **Incidents** - Incidents related to threats
4. **Vulnerabilities** - Known system vulnerabilities
5. **SecurityUpdates** - Patches and updates for vulnerabilities

All relationships are maintained with proper foreign keys and business rule triggers.

### Troubleshooting

#### MySQL Connection Error
If you get "Access denied for user 'root'@'localhost'":

1. Check if MySQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status mysql
   ```

2. Update your `.env` file with correct credentials

3. If you don't know your MySQL password:
   ```bash
   # macOS with Homebrew (no password by default)
   mysql -u root
   
   # Linux
   sudo mysql -u root
   ```

#### Database Already Exists
If you get an error about the database existing, that's normal. The script checks if it exists first.

#### Port Already in Use
If port 3000 is already in use, change it in `.env`:
```
PORT=3001
```

### Testing the Application

1. Open `http://localhost:3000` in your browser
2. Login with one of the default credentials
3. Try the following:
   - Create new users (Admin only)
   - Log threats
   - Create incidents
   - Add vulnerabilities
   - Create security updates

### Project Structure

```
.
├── server.js              # Main server file with all API endpoints
├── database.sql           # Database schema and sample data
├── package.json           # Project dependencies
├── .env.example          # Environment variables template
├── README.md             # This file
└── public/
    ├── index.html        # Login page
    ├── users.html        # Users management
    ├── threats.html      # Threat logs
    ├── incidents.html    # Incident management
    ├── vulnerabilities.html # Vulnerabilities
    ├── updates.html      # Security updates
    ├── css/
    │   └── styles.css    # Main stylesheet
    └── js/
        └── main.js       # Utility functions
```

### Features Implemented

✅ User authentication and role-based access
✅ Complete CRUD operations for all modules
✅ Real-time data loading
✅ Severity and status filtering
✅ Business rule validation (set in database triggers)
✅ Session-based security
✅ Responsive design
✅ Modal forms for data entry
✅ Statistics dashboard
✅ Error handling and user feedback

### Security Features

- Role-based access control
- Session storage for authentication
- SQL injection prevention (using parameterized queries)
- Input validation on forms
- Business rule enforcement via database triggers
- CORS enabled for API access

### Development

To modify the code:
1. Edit server.js for backend changes
2. Edit HTML/CSS/JS files in the `public/` folder for frontend changes
3. Restart the server to see changes

### Support

For issues:
1. Check the console for error messages
2. Verify MySQL is running and accessible
3. Make sure all environment variables are set correctly
4. Check that port 3000 is not in use
