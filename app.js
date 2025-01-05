const express = require("express");
const eventRouter = require("./routes/eventRoutes");
const userRouter = require("./routes/userRoutes");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

// Middleware For Sending HTTPS Response Headers
app.use(helmet());

// Rate Limiting Middelware
const limit = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too Many Requests From This IP, Please Try Again!",
});
app.use("/api", limit);

// Middleware For Data Sanitization Against NoSQL Query Injection
app.use(mongoSanitize());

// Middleware For Data Sanitization Against XSS
app.use(xss());

// Middleware For Controlling Paramter Population
app.use(hpp());

app.use(express.json());

app.use("/api/v1/events", eventRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
