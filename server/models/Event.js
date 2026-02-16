const mongoose = require("mongoose");

// Event schema
const eventSchema = new mongoose.Schema({
  name: String,
  organizer: String,
  location: String,
  date: Date,
  description: String,
  capacity: Number,
  category: String
});

module.exports = mongoose.model("Event", eventSchema);
