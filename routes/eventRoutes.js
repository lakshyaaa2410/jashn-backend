const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");
const authController = require("../controllers/authController");

router.route("/search").get(eventController.searchEvent);

router
	.route("/")
	.get(authController.protect, eventController.getAllEvents)
	.post(eventController.addEvent);

router
	.route("/:id")
	.get(eventController.getSingleEvent)
	.delete(
		authController.protect,
		authController.restrictTo("admin", "organizer"),
		eventController.deleteEvent
	)
	.patch(eventController.updateEvent);

module.exports = router;
