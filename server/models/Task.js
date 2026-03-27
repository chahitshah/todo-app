const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  userId: String,
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model("Task", taskSchema);
