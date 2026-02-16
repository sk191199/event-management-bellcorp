# Bellcorp Event Management Application

A full-stack web application for discovering, viewing, and managing event registrations. Built with React.js, Node.js, Express.js, and MongoDB.

## 🎯 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Event Discovery**: Browse all available events with real-time search and filtering
- **Smart Filtering**: Filter events by category, location, and search keywords
- **Event Registration**: Register for events with capacity validation
- **User Dashboard**: View upcoming and past registered events
- **Responsive Design**: Material-UI powered beautiful and responsive interface
- **Real-time Updates**: Instant feedback on registration and capacity changes

## 📋 Project Structure

```
event-management-bellcorp/
├── server/
│   ├── models/
│   │   ├── User.js          # User schema with email and password
│   │   ├── Event.js         # Event schema with details and capacity
│   │   └── Registration.js  # Join table linking users to events
│   ├── routes/
│   │   ├── authRoutes.js    # Signup and login endpoints
│   │   ├── eventRoutes.js   # Event CRUD and search/filter
│   │   └── registrationRoutes.js  # Register, unregister endpoints
│   ├── middleware/
│   │   └── protect.js       # JWT authentication middleware
│   ├── seed.js              # Script to populate DB with sample events
│   ├── server.js            # Express app entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
└── client/
    └── bellcorp-client/
        ├── src/
        │   ├── pages/
        │   │   ├── Login.js         # Login page
        │   │   ├── Register.js      # Signup page
        │   │   ├── Events.js        # Events discovery page
        │   │   ├── EventDetails.js  # Event details page
        │   │   └── Dashboard.js     # User dashboard with registrations
        │   ├── context/
        │   │   └── AuthContext.js   # Global auth state management
        │   ├── api.js               # Axios instance with all endpoints
        │   ├── App.js               # Routes and protected routes
        │   └── index.js
        └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account (or local MongoDB)
- Git installed

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file with your MongoDB URI:**
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/?appName=Cluster0
   JWT_SECRET=supersecretkey191199
   ```

4. **Seed the database with sample events:**
   ```bash
   node seed.js
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client/bellcorp-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

- **POST /api/auth/signup**
  - Register a new user
  - Body: `{ name, email, password }`
  - Returns: User object

- **POST /api/auth/login**
  - Login user and get JWT token
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

### Events Endpoints

- **GET /api/events**
  - Get all events with optional filters
  - Query params: `search`, `category`, `location`
  - Returns: Array of events with registration count and available seats

- **GET /api/events/:id**
  - Get single event details
  - Returns: Event object with availability info

- **GET /api/events/user/registrations/all** (Protected)
  - Get user's registered events
  - Returns: `{ upcoming: [...], past: [...] }`

### Registration Endpoints (Protected)

- **POST /api/register/:eventId**
  - Register user for an event
  - Returns: Success message

- **DELETE /api/register/:eventId**
  - Cancel registration from an event
  - Returns: Success message

- **GET /api/register/:eventId/check**
  - Check if user is registered for an event
  - Returns: `{ isRegistered: boolean }`

## 🔐 Security Features

- **Password Hashing**: Passwords hashed with bcryptjs (salt rounds: 10)
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Frontend routes protected by authentication
- **Capacity Validation**: Backend validates capacity on registration
- **Duplicate Prevention**: Prevents duplicate registrations for same event
- **Token Expiration**: JWT tokens expire in 7 days

## 💾 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Event Collection
```javascript
{
  _id: ObjectId,
  name: String,
  organizer: String,
  location: String,
  date: Date,
  description: String,
  capacity: Number,
  category: String
}
```

### Registration Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  event: ObjectId (ref: Event)
}
```

## 🭋 Usage Flow

1. **User Registration**
   - New user signs up via `/signup` page
   - Password is hashed and stored securely
   - Redirected to login page

2. **User Login**
   - User logs in with email and password
   - JWT token is issued and stored locally
   - Redirected to events discovery page

3. **Event Discovery**
   - User views all available events
   - Can search by event name
   - Can filter by category or location
   - Sees real-time seat availability

4. **Event Details**
   - Click "View Details" to see full event information
   - Check registration status
   - Register if seats available

5. **User Dashboard**
   - View registered events split into:
     - **Upcoming**: Events in the future
     - **Past**: Events that have already occurred
   - Access from navigation or after login
   - Cancel registrations from this page

## 🎨 UI Components

All components built with **Material-UI** for consistent design:
- Cards with event information
- Chips for categories and location
- Search and filter form
- Snackbar notifications
- Responsive grid layout
- Protected route wrapper

## 📊 Sample Data

The seed script populates the database with 15 sample events across:
- **Categories**: Technology, Design, Database
- **Locations**: New York, San Francisco, Los Angeles, Chicago, Boston, Austin, and more
- **Date Range**: March-April 2026
- **Capacity Range**: 25-60 seats per event

## 🧪 Testing with Postman/Insomnia

### Test Signup
```
POST http://localhost:5000/api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Test Login
```
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Test Get Events
```
GET http://localhost:5000/api/events?search=React&category=Technology
```

### Test Register (with token from login)
```
POST http://localhost:5000/api/register/[EVENT_ID]
Headers:
  Authorization: Bearer [JWT_TOKEN]
```

## 🚀 Deployment

### Backend (Render/Railway)
```bash
# Create new web service
# Connect GitHub repo
# Set environment variables in dashboard
# Deploy
```

### Frontend (Vercel/Netlify)
```bash
# Update API base URL in api.js to live backend
# Deploy via GitHub integration
```

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=complex-secret-key-here
```

### Client (api.js)
Update baseURL for production:
```javascript
const API = axios.create({
  baseURL: "https://your-live-backend-url.com/api",
});
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Verify connection string in .env
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure username/password are correct

### Frontend not connecting to backend
- Ensure backend is running on port 5000
- Check CORS is enabled in server.js (it is)
- Verify API base URL in api.js matches backend URL

### Port already in use
- Kill process on that port or use different port
- Update PORT in .env for backend

## 📱 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License
MIT

## 👨‍💻 Author
Bellcorp Event Management Team

---

**Ready to use!** Follow the Quick Start section to get the application running locally.
