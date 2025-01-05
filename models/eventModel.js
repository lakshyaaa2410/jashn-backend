const { default: mongoose } = require("mongoose");

const eventSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	category: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	time: {
		type: String,
		required: true,
		validate: {
			validator: (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value),
			message: "Time must be in HH:MM format",
		},
	},
	minPrice: {
		type: Number,
		required: true,
	},
	maxPrice: {
		type: Number,
		required: true,
	},
	availability: {
		type: String,
		required: true,
	},
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
