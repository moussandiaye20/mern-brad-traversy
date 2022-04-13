const express = require("express");

const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
connectDB();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const colors = require("colors");
const goalRoutes = require("./routes/goals");
const userRoutes = require("./routes/users");
app.use("/api/v1/goals", goalRoutes);
app.use("/api/v1/users", userRoutes);

app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));
