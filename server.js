const app = require("./app.js");
const mongoose = require("mongoose");
const PORT = 5000;

require("dotenv").config();

const mongoURL = process.env.MONGO_DB_URL;

mongoose.connect(mongoURL).then(() => {
	console.log("Connection Successfull");
});

app.listen(PORT, function () {
	console.log(`Server Running On ${PORT}`);
});
