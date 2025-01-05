const Event = require("../models/eventModel");

exports.getAllEvents = async function (req, res) {
	const data = await Event.find();
	try {
		return res.status(200).json({
			status: "success",
			data: {
				events: data,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "failed",
			data: {
				err,
			},
		});
	}
};

exports.getSingleEvent = async function (req, res) {
	const eventId = req.params.id;
	try {
		const data = await Event.findById(eventId);

		if (!data) {
			return res.status(404).json({
				status: "error",
				message: `Cannot Find Any Event With ID ${eventId}`,
			});
		}

		return res.status(200).json({
			status: "success",
			data: { event: data },
		});
	} catch (err) {
		return res.status(500).json({
			status: "error",
			message: err.message || "An unexpected error occurred",
		});
	}
};

exports.addEvent = async function (req, res) {
	const newEventReq = req.body;

	try {
		const newEvent = await Event.create(newEventReq);
		return res.status(200).json({
			status: "success",
			data: {
				event: newEvent,
			},
		});
	} catch (err) {
		res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

exports.deleteEvent = async function (req, res) {
	const eventId = req.params.id;

	try {
		const event = await Event.findByIdAndDelete(eventId);
		if (event) {
			return res.status(200).json({
				status: "success",
				message: "Event Successfully Deleted",
			});
		} else {
			return res.status(404).json({
				status: "failed",
				message: "No Event Found With This ID",
			});
		}
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

exports.updateEvent = async function (req, res) {
	const eventId = req.params.id;
	const updatedEvent = req.body;

	try {
		const event = await Event.updateOne({ _id: eventId }, updatedEvent);

		if (event.modifiedCount != 0) {
			return res.status(200).json({
				status: "success",
				data: {
					event,
				},
			});
		} else {
			res.status(404).json({
				status: "failed",
				message: "Cannot Find Event With This Id",
			});
		}
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

exports.searchEvent = async function (req, res) {
	const city = req.query.location || req.query.city;

	if (!city) {
		return res.status(400).json({
			status: "failed",
			message: "City or Locaiton parameter is required",
		});
	}

	try {
		const data = await Event.find({ city });
		if (data.length > 0) {
			return res.status(200).json({
				status: "success",
				totalEvents: data.length,
				data: {
					events: data,
				},
			});
		} else {
			return res.status(404).json({
				status: "failed",
				message: "No Events In The Specified City",
			});
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};
