const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const protect = require("../middleware/protect");

const router = express.Router();

// Get user's registered events (MUST be before /:id route)
router.get("/user/registrations/all", protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event");

    const events = registrations.map(reg => ({
      ...reg.event.toObject(),
      registeredAt: reg._id
    }));

    // Separate upcoming and past events
    const today = new Date();
    const upcoming = events.filter(e => new Date(e.date) > today);
    const past = events.filter(e => new Date(e.date) <= today);

    res.json({
      upcoming: upcoming.sort((a, b) => new Date(a.date) - new Date(b.date)),
      past: past.sort((a, b) => new Date(b.date) - new Date(a.date))
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get All Events with Search & Filter
router.get("/", async (req, res) => {
  try {
    const { search, category, location } = req.query;

    let query = {};

    if (search)
      query.name = { $regex: search, $options: "i" };

    if (category)
      query.category = category;

    if (location)
      query.location = { $regex: location, $options: "i" };

    const events = await Event.find(query);

    // Add registrationCount to each event
    const eventsWithCount = await Promise.all(
      events.map(async (event) => {
        const count = await Registration.countDocuments({ event: event._id });
        return {
          ...event.toObject(),
          registrationCount: count,
          availableSeats: event.capacity - count
        };
      })
    );

    res.json(eventsWithCount);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get Single Event Details
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const count = await Registration.countDocuments({ event: event._id });

    res.json({
      ...event.toObject(),
      registrationCount: count,
      availableSeats: event.capacity - count
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
