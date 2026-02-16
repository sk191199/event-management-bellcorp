const mongoose = require("mongoose");

// Create User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);
