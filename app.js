const express = require("express");
const eventRouter = require("./routes/eventRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

app.use(express.json());

app.use("/api/v1/events", eventRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
