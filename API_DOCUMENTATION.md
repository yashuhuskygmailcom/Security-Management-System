# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
The system uses role-based authentication. Users must login first to get their session stored in browser's sessionStorage.

---

## Users Endpoints

### Create User
**POST** `/api/users`
```json
{
  "Name": "John Doe",
  "Email": "john@example.com",
  "Role": "Security Analyst"
}
```
**Response**:
```json
{
  "message": "User created successfully",
  "userId": 4
}
```

### Get All Users
**GET** `/api/users`

**Response**:
```json
[
  {
    "UserID": 1,
    "Name": "Admin User",
    "Email": "admin@security.com",
    "Role": "Admin",
    "CreatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Single User
**GET** `/api/users/:id`

### Delete User
**DELETE** `/api/users/:id`
**Response**:
```json
{
  "message": "User deleted successfully"
}
```

---

## Threats Endpoints

### Log New Threat
**POST** `/api/threats`
```json
{
  "UserID": 1,
  "Type": "Malware",
  "Severity": "High",
  "DetectedDate": "2024-01-20"
}
```
**Response**:
```json
{
  "message": "Threat logged successfully",
  "threatId": 4
}
```

### Get All Threats
**GET** `/api/threats`

**Query Parameters**:
- `severity`: Filter by severity level (Low, Medium, High, Critical)

**Example**: `/api/threats?severity=Critical`

**Response**:
```json
[
  {
    "ThreatID": 1,
    "UserID": 1,
    "Type": "Malware",
    "Severity": "High",
    "DetectedDate": "2024-01-15",
    "UserName": "Admin User"
  }
]
```

### Get Single Threat
**GET** `/api/threats/:id`

### Delete Threat
**DELETE** `/api/threats/:id`
**Response**:
```json
{
  "message": "Threat deleted successfully"
}
```

---

## Incidents Endpoints

### Create Incident
**POST** `/api/incidents`
```json
{
  "ThreatID": 1,
  "ActionTaken": "Quarantined infected files",
  "Status": "Resolved"
}
```
**Response**:
```json
{
  "message": "Incident created successfully",
  "incidentId": 4
}
```

### Get All Incidents
**GET** `/api/incidents`

**Response**:
```json
[
  {
    "IncidentID": 1,
    "ThreatID": 1,
    "ActionTaken": "Quarantined infected files",
    "Status": "Resolved",
    "CreatedAt": "2024-01-15T10:30:00.000Z",
    "ThreatType": "Malware",
    "Severity": "High"
  }
]
```

### Get Single Incident
**GET** `/api/incidents/:id`

### Update Incident
**PUT** `/api/incidents/:id`
```json
{
  "ActionTaken": "Updated action description",
  "Status": "In Progress"
}
```
**Response**:
```json
{
  "message": "Incident updated successfully"
}
```

### Delete Incident
**DELETE** `/api/incidents/:id`
**Response**:
```json
{
  "message": "Incident deleted successfully"
}
```

---

## Vulnerabilities Endpoints

### Add Vulnerability
**POST** `/api/vulnerabilities`
```json
{
  "Description": "SQL Injection in login form",
  "PatchAvailable": true
}
```
**Response**:
```json
{
  "message": "Vulnerability created successfully",
  "vulnerabilityId": 4
}
```

### Get All Vulnerabilities
**GET** `/api/vulnerabilities`

**Response**:
```json
[
  {
    "VulnerabilityID": 1,
    "Description": "SQL Injection in login form",
    "PatchAvailable": true,
    "CreatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Delete Vulnerability
**DELETE** `/api/vulnerabilities/:id`
**Response**:
```json
{
  "message": "Vulnerability deleted successfully"
}
```

---

## Security Updates Endpoints

### Add Security Update
**POST** `/api/updates`
```json
{
  "VulnerabilityID": 1,
  "ReleaseDate": "2024-01-20"
}
```
**Response**:
```json
{
  "message": "Security update created successfully",
  "updateId": 4
}
```

### Get All Updates
**GET** `/api/updates`

**Response**:
```json
[
  {
    "UpdateID": 1,
    "VulnerabilityID": 1,
    "ReleaseDate": "2024-01-20",
    "VulnerabilityDescription": "SQL Injection in login form"
  }
]
```

### Get Updates for Specific Vulnerability
**GET** `/api/updates/vulnerability/:id`

### Delete Update
**DELETE** `/api/updates/:id`
**Response**:
```json
{
  "message": "Security update deleted successfully"
}
```

---

## Authentication Endpoint

### User Login
**POST** `/api/login`
```json
{
  "Email": "admin@security.com",
  "Role": "Admin"
}
```
**Response**:
```json
{
  "message": "Login successful",
  "user": {
    "UserID": 1,
    "Name": "Admin User",
    "Email": "admin@security.com",
    "Role": "Admin",
    "CreatedAt": "2024-01-15T10:30:00.000Z"
  },
  "redirect": "users.html"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email already exists"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message describing the problem"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Business Rules

1. **Incident Status**: Cannot set status to "Resolved" without providing ActionTaken
2. **Patch Updates**: If PatchAvailable = TRUE for a vulnerability, it must have at least one SecurityUpdate entry

---

## Using with Frontend

The frontend automatically makes these API calls:
- Login form sends POST to `/api/login`
- User pages send requests to `/api/users`
- Threat pages send requests to `/api/threats`
- Incident pages send requests to `/api/incidents`
- Vulnerability pages send requests to `/api/vulnerabilities`
- Update pages send requests to `/api/updates`

All requests include proper headers and JSON content type.
