const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const eventsController = require("../controllers/events");

router.get("/events", auth, eventsController.getEvents);
router.post("/events", auth, eventsController.createEvent);
router.delete("/events/:id", auth, eventsController.deleteEvent);

module.exports = router;