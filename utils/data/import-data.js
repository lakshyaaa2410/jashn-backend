const fs = require("fs");
const mongoose = require("mongoose");
const Event = require("../../models/eventModel");

const events = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));
const mongoURL = `mongodb+srv://lakshyachoudhary2020:f2lT0hcsK5y6Cvte@jashn.cik9j.mongodb.net/jashn?retryWrites=true&w=majority`;

mongoose
	.connect(mongoURL)
	.then(console.log("Connection Success"))
	.catch((err) => {
		console.log(err);
	});

const importData = async () => {
	try {
		await Event.create(events);
		console.log("Data Inserted Successfully!");
	} catch (err) {
		console.log(err);
	}

	process.exit();
};

const deleteData = async () => {
	try {
		await Event.deleteMany();
		console.log("Data Deleted Successfully!");
	} catch (err) {
		console.log(err);
	}

	process.exit();
};

if (process.argv[2] === "--import") importData();
else if (process.argv[2] === "--delete") deleteData();
