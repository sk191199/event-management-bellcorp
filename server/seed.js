const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./models/Event");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// Sample Events Data
const sampleEvents = [
  {
    name: "React Bootcamp",
    organizer: "Tech Academy",
    location: "New York",
    date: new Date("2026-03-15"),
    description: "Learn React.js from basics to advanced",
    capacity: 50,
    category: "Technology"
  },
  {
    name: "JavaScript Workshop",
    organizer: "Code Masters",
    location: "San Francisco",
    date: new Date("2026-03-20"),
    description: "Intensive JavaScript training for beginners",
    capacity: 30,
    category: "Technology"
  },
  {
    name: "Web Design Masterclass",
    organizer: "Design Studios",
    location: "Los Angeles",
    date: new Date("2026-04-05"),
    description: "Learn modern web design principles",
    capacity: 25,
    category: "Design"
  },
  {
    name: "Node.js & Express.js",
    organizer: "Backend Academy",
    location: "Chicago",
    date: new Date("2026-03-25"),
    description: "Build scalable backend applications",
    capacity: 40,
    category: "Technology"
  },
  {
    name: "MongoDB Advanced",
    organizer: "Database Pro",
    location: "Boston",
    date: new Date("2026-04-10"),
    description: "Advanced MongoDB database design",
    capacity: 35,
    category: "Database"
  },
  {
    name: "Full Stack Developer Path",
    organizer: "Full Stack Academy",
    location: "Austin",
    date: new Date("2026-04-01"),
    description: "Complete journey from frontend to backend",
    capacity: 60,
    category: "Technology"
  },
  {
    name: "CSS & Responsive Design",
    organizer: "Frontend Pro",
    location: "Seattle",
    date: new Date("2026-03-30"),
    description: "Master modern CSS and responsive layouts",
    capacity: 45,
    category: "Design"
  },
  {
    name: "API Development Essentials",
    organizer: "API Masters",
    location: "Denver",
    date: new Date("2026-04-15"),
    description: "RESTful API design and best practices",
    capacity: 38,
    category: "Technology"
  },
  {
    name: "React Hooks Deep Dive",
    organizer: "React Experts",
    location: "Portland",
    date: new Date("2026-03-18"),
    description: "Understanding React Hooks and state management",
    capacity: 32,
    category: "Technology"
  },
  {
    name: "Web Performance Optimization",
    organizer: "Performance Team",
    location: "Miami",
    date: new Date("2026-04-08"),
    description: "Optimize websites for speed and performance",
    capacity: 28,
    category: "Technology"
  },
  {
    name: "TypeScript for Developers",
    organizer: "TypeScript Academy",
    location: "Atlanta",
    date: new Date("2026-03-22"),
    description: "Learn TypeScript for robust applications",
    capacity: 40,
    category: "Technology"
  },
  {
    name: "Testing & QA Fundamentals",
    organizer: "QA Academy",
    location: "Philadelphia",
    date: new Date("2026-04-12"),
    description: "Unit testing, integration testing, and QA",
    capacity: 35,
    category: "Technology"
  },
  {
    name: "UI/UX Design Workshop",
    organizer: "UX Design Co",
    location: "San Diego",
    date: new Date("2026-03-28"),
    description: "Create beautiful and functional user interfaces",
    capacity: 30,
    category: "Design"
  },
  {
    name: "DevOps & Deployment",
    organizer: "DevOps Academy",
    location: "Phoenix",
    date: new Date("2026-04-18"),
    description: "CI/CD pipelines and cloud deployment",
    capacity: 25,
    category: "Technology"
  },
  {
    name: "GraphQL Mastery",
    organizer: "GraphQL Academy",
    location: "Dallas",
    date: new Date("2026-04-02"),
    description: "Build efficient APIs with GraphQL",
    capacity: 33,
    category: "Technology"
  }
];

// Seed function
async function seedDatabase() {
  try {
    // Clear existing events
    await Event.deleteMany({});
    console.log("Cleared existing events");

    // Insert sample events
    await Event.insertMany(sampleEvents);
    console.log("✅ Database seeded with", sampleEvents.length, "events!");

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.log("❌ Error seeding database:", error);
    mongoose.connection.close();
  }
}

seedDatabase();
