# Bellcorp Event Management - API Testing Guide

## 🧪 Test Scenarios

This document provides complete test cases for all API endpoints.

## 1️⃣ Authentication Tests

### Test 1.1: User Signup

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "securePassword123"
}
```

**Expected Response (200):**
```json
{
  "message": "User Registered Successfully"
}
```

**Error Cases:**
- User already exists: `400 Bad Request` - "User already exists"
- Missing fields: `500 Server Error`

---

### Test 1.2: User Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "securePassword123"
}
```

**Expected Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Alice Johnson",
    "email": "alice@example.com"
  }
}
```

**Error Cases:**
- Invalid email: `400 Bad Request` - "Invalid Credentials"
- Wrong password: `400 Bad Request` - "Invalid Credentials"

---

## 2️⃣ Event Tests

### Test 2.1: Get All Events

**Request:**
```http
GET /api/events
```

**Expected Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "React Bootcamp",
    "organizer": "Tech Academy",
    "location": "New York",
    "date": "2026-03-15T00:00:00.000Z",
    "description": "Learn React.js from basics to advanced",
    "capacity": 50,
    "category": "Technology",
    "registrationCount": 5,
    "availableSeats": 45
  },
  // ... more events
]
```

---

### Test 2.2: Search Events

**Request:**
```http
GET /api/events?search=React
```

**Expected Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "React Bootcamp",
    "organizer": "Tech Academy",
    "location": "New York",
    "date": "2026-03-15T00:00:00.000Z",
    "description": "Learn React.js from basics to advanced",
    "capacity": 50,
    "category": "Technology",
    "registrationCount": 5,
    "availableSeats": 45
  }
]
```

---

### Test 2.3: Filter by Category

**Request:**
```http
GET /api/events?category=Technology
```

**Expected Response (200):** Array of all Technology category events

---

### Test 2.4: Filter by Location

**Request:**
```http
GET /api/events?location=New York
```

**Expected Response (200):** Array of all New York location events

---

### Test 2.5: Combined Filters

**Request:**
```http
GET /api/events?search=React&category=Technology&location=New York
```

**Expected Response (200):** Array of events matching all criteria

---

### Test 2.6: Get Single Event

**Request:**
```http
GET /api/events/507f1f77bcf86cd799439012
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "React Bootcamp",
  "organizer": "Tech Academy",
  "location": "New York",
  "date": "2026-03-15T00:00:00.000Z",
  "description": "Learn React.js from basics to advanced",
  "capacity": 50,
  "category": "Technology",
  "registrationCount": 5,
  "availableSeats": 45
}
```

**Error Cases:**
- Event not found: `404 Not Found` - "Event not found"

---

### Test 2.7: Get User's Events (Protected)

**Request:**
```http
GET /api/events/user/registrations/all
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response (200):**
```json
{
  "upcoming": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "React Bootcamp",
      "organizer": "Tech Academy",
      "location": "New York",
      "date": "2026-03-15T00:00:00.000Z",
      "description": "Learn React.js from basics to advanced",
      "capacity": 50,
      "category": "Technology",
      "registeredAt": "507f1f77bcf86cd799439999"
    }
  ],
  "past": []
}
```

**Error Cases:**
- No token: `401 Unauthorized` - "Not Authorized"
- Invalid token: `401 Unauthorized` - "Token Invalid"

---

## 3️⃣ Registration Tests

### Test 3.1: Register for Event (Protected)

**Request:**
```http
POST /api/register/507f1f77bcf86cd799439012
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response (200):**
```json
{
  "message": "Registered Successfully"
}
```

**Error Cases:**
- Event full: `400 Bad Request` - "Event Full"
- Already registered: `400 Bad Request` - "Already Registered"
- Event not found: `404 Not Found` - "Event not found"
- No token: `401 Unauthorized` - "Not Authorized"

---

### Test 3.2: Check Registration Status (Protected)

**Request:**
```http
GET /api/register/507f1f77bcf86cd799439012/check
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response (200):**
```json
{
  "isRegistered": true
}
```

Or if not registered:
```json
{
  "isRegistered": false
}
```

---

### Test 3.3: Unregister from Event (Protected)

**Request:**
```http
DELETE /api/register/507f1f77bcf86cd799439012
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response (200):**
```json
{
  "message": "Unregistered Successfully"
}
```

**Error Cases:**
- Not registered: `404 Not Found` - "Registration not found"
- No token: `401 Unauthorized` - "Not Authorized"

---

## 🔄 Complete User Journey

### Step 1: Create Account
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Step 2: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
Save the returned `token` for the next steps.

### Step 3: Browse Events
```bash
curl http://localhost:5000/api/events
```

### Step 4: Search for Specific Event
```bash
curl "http://localhost:5000/api/events?search=React&category=Technology"
```

### Step 5: Get Event Details
```bash
curl http://localhost:5000/api/events/[EVENT_ID]
```

### Step 6: Register for Event
```bash
curl -X POST http://localhost:5000/api/register/[EVENT_ID] \
  -H "Authorization: Bearer [TOKEN]"
```

### Step 7: Check Registration Status
```bash
curl http://localhost:5000/api/register/[EVENT_ID]/check \
  -H "Authorization: Bearer [TOKEN]"
```

### Step 8: Get User's Events
```bash
curl http://localhost:5000/api/events/user/registrations/all \
  -H "Authorization: Bearer [TOKEN]"
```

### Step 9: Cancel Registration
```bash
curl -X DELETE http://localhost:5000/api/register/[EVENT_ID] \
  -H "Authorization: Bearer [TOKEN]"
```

---

## 📊 Sample Data Counts

After running `node seed.js`:

- **Total Events**: 15
- **Categories**: Technology (10), Design (3), Database (2)
- **Locations**: 15 different cities
- **Date Range**: March 15 - April 18, 2026
- **Capacity Range**: 25-60 seats per event

---

## ✅ Test Checklist

- [ ] Create account (signup)
- [ ] Login with correct credentials
- [ ] Login fails with wrong password
- [ ] Browse all events
- [ ] Search events by name
- [ ] Filter by category
- [ ] Filter by location
- [ ] Combined filters work correctly
- [ ] View event details
- [ ] Register for event
- [ ] Cannot register twice for same event
- [ ] Cannot register when event is full
- [ ] Check registration status
- [ ] View user's upcoming events
- [ ] View user's past events
- [ ] Unregister from event
- [ ] Protected routes require token
- [ ] Invalid token returns 401
