# 🚀 Quick Reference Guide

## Start the Application

```bash
# Install dependencies (first time only)
npm install

# Setup database (choose one)
./setup.sh              # Automated
# OR
mysql -u root -p < database.sql

# Start the server
npm start

# Open in browser
http://localhost:3000
```

---

## Login Credentials

| Email | Role | 
|-------|------|
| admin@security.com | Admin |
| john@security.com | Security Analyst |
| jane@security.com | User |

Just select the role - no password needed!

---

## File Locations

| What | Where |
|------|-------|
| Backend Code | `server.js` |
| Frontend CSS | `public/css/styles.css` |
| Frontend JS | `public/js/main.js` |
| Database Schema | `database.sql` |
| Config | `.env` |
| API Docs | `API_DOCUMENTATION.md` |

---

## Common Tasks

### Add a new user (Admin only)
1. Click "Add User" button
2. Fill in name, email, and role
3. Click "Save User"

### Log a threat (Analyst/Admin)
1. Go to "Threat Logs"
2. Click "+ Log Threat"
3. Select type, severity, and date
4. Click "Log Threat"

### Create an incident
1. Go to "Incidents"
2. Click "+ Create Incident"
3. Select threat, add action, select status
4. Click "Save Incident"

### Add vulnerability
1. Go to "Vulnerabilities"
2. Click "+ Add Vulnerability"
3. Describe the vulnerability
4. Mark if patch is available
5. Click "Add Vulnerability"

### Add security update
1. Go to "Security Updates"
2. Click "+ Add Security Update"
3. Select vulnerability
4. Set release date
5. Click "Add Update"

---

## Troubleshooting

### Port 3000 in use
Change in `.env`:
```
PORT=3001
```

### MySQL not connecting
1. Start MySQL: `brew services start mysql`
2. Check `.env` has correct credentials
3. Verify database exists: `mysql -u root -e "SHOW DATABASES;"`

### Need to reset database
```bash
mysql -u root -p -e "DROP DATABASE securitymanagementsystem;"
mysql -u root -p < database.sql
```

---

## API Quick Examples

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"Email":"admin@security.com","Role":"Admin"}'
```

### Get all threats
```bash
curl http://localhost:3000/api/threats
```

### Create user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"Name":"Jane","Email":"jane@test.com","Role":"User"}'
```

---

## Environment Variables

```
DB_HOST=localhost           # MySQL server
DB_USER=root                # MySQL username
DB_PASSWORD=your_password   # MySQL password
DB_NAME=securitymanagementsystem  # Database name
PORT=3000                   # Server port
```

---

## Database Tables

| Table | Purpose |
|-------|---------|
| Users | System users |
| ThreatLogs | Detected threats |
| Incidents | Incidents from threats |
| Vulnerabilities | Known vulnerabilities |
| SecurityUpdates | Patches for vulnerabilities |

---

## Roles & Permissions

### Admin
- Manage users
- View everything
- Create/edit/delete anything

### Security Analyst
- Create threats and incidents
- View all data
- Cannot manage users

### User
- View vulnerabilities and updates only
- Read-only access
- No create/edit/delete

---

## Code Modifications

### Add new column to users table
1. Edit `database.sql`
2. Recreate database
3. Update `server.js` queries
4. Update HTML forms

### Add new API endpoint
1. Add route in `server.js`
2. Add query logic
3. Export endpoint
4. Call from frontend

### Add new page
1. Create HTML in `public/`
2. Add styling to `styles.css`
3. Add JavaScript functions
4. Add navigation link in sidebar

---

## Key Files

**server.js** - All API endpoints
- Lines 1-50: Setup & config
- Lines 51-100: Users API
- Lines 101-150: Threats API
- Lines 151-200: Incidents API
- Lines 201-250: Vulnerabilities API
- Lines 251-300: Updates API

**styles.css** - All styling
- Lines 1-50: Variables & reset
- Lines 51-100: Login page
- Lines 101-150: Dashboard layout
- Lines 151-200: Tables & badges
- Lines 201-250: Modals & forms

---

## Testing Checklist

- [ ] Login with each role
- [ ] Create new user
- [ ] Log a threat
- [ ] Filter threats by severity
- [ ] Create an incident
- [ ] Edit an incident
- [ ] Add vulnerability
- [ ] Add security update
- [ ] Delete records
- [ ] Check statistics update
- [ ] Test on mobile (responsive)

---

## Performance Tips

- Use `npm start` for production
- Monitor MySQL connections
- Add caching for frequently accessed data
- Use database indexes for better queries
- Consider pagination for large datasets

---

## Security Notes

- Don't hardcode passwords
- Use HTTPS in production
- Add rate limiting for API
- Implement proper authentication
- Validate all inputs
- Keep dependencies updated

---

## Useful Commands

```bash
# Check Node.js version
node --version

# Check npm version  
npm --version

# List installed packages
npm list

# Start with debugging
DEBUG=* npm start

# Check MySQL
mysql -u root -e "SELECT 1;"

# View database
mysql -u root securitymanagementsystem -e "SHOW TABLES;"

# Export database
mysqldump -u root securitymanagementsystem > backup.sql

# Import database
mysql -u root securitymanagementsystem < backup.sql
```

---

## Documentation

- **README.md** - Overview & features
- **SETUP_INSTRUCTIONS.md** - Setup guide
- **API_DOCUMENTATION.md** - API reference
- **COMPLETION_SUMMARY.md** - What's included
- **This file** - Quick reference

---

**Everything is ready to go!** 🎉
