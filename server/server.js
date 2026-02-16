// Import packages
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load .env variables
dotenv.config();

const app = express();

// Middlewares

app.use(cors({
  origin: "https://bellcorp-event-project.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
})); // allow frontend requests

app.use(express.json()); // parse JSON data


// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("MongoDB Error:", err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/register", require("./routes/registrationRoutes"));

// Start server
app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
