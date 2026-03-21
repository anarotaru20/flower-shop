const repo = require("../repo/events");

async function getEvents(req, res, next) {
  try {
    const userId = req.user.id;
    const data = await repo.getEventsByUserId(userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function createEvent(req, res, next) {
  try {
    const userId = req.user.id;

    const payload = {
      ...req.body,
      user_id: userId,
    };

    const data = await repo.createEvent(payload);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await repo.deleteEventById(id, userId);

    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    next(error);
  }
}

async function updateEvent(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await repo.updateEventById(id, userId, req.body);

    if (!data) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
};
