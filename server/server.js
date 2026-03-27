const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// middleware for logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const summaryRoutes = require("./routes/summary");

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/summary", summaryRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(5000, () => console.log("Server running on port 5000"));
