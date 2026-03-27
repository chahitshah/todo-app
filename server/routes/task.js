const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// add task
router.post("/add", async (req, res) => {
  try {
    const { title, description, dueDate, priority, userId } = req.body;
    const task = await Task.create({ 
      title, 
      description, 
      dueDate, 
      priority, 
      userId 
    });
    res.json(task);
  } catch (err) {
    console.error("Add Task Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// get tasks
router.get("/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json("Deleted");
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// update task (for completion and editing)
router.put("/:id", async (req, res) => {
  try {
    const { title, description, dueDate, priority, completed } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, priority, completed },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
