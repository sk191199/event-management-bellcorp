const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const protect = require("../middleware/protect");

const router = express.Router();

// Register for Event
router.post("/:eventId", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const count = await Registration.countDocuments({
      event: event._id
    });

    if (count >= event.capacity)
      return res.status(400).json({ message: "Event Full" });

    const alreadyRegistered = await Registration.findOne({
      user: req.user._id,
      event: event._id
    });

    if (alreadyRegistered)
      return res.status(400).json({ message: "Already Registered" });

    await Registration.create({
      user: req.user._id,
      event: event._id
    });

    res.json({ message: "Registered Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Cancel Registration
router.delete("/:eventId", protect, async (req, res) => {
  try {
    const registration = await Registration.findOneAndDelete({
      user: req.user._id,
      event: req.params.eventId
    });

    if (!registration)
      return res.status(404).json({ message: "Registration not found" });

    res.json({ message: "Unregistered Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Check if User is Registered for Event
router.get("/:eventId/check", protect, async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user._id,
      event: req.params.eventId
    });

    res.json({ isRegistered: !!registration });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
