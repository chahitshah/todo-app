const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// add task
router.post("/add", async (req, res) => {
  const { title, userId } = req.body;

  const task = await Task.create({ title, userId });

  res.json(task);
});

// get tasks
router.get("/:userId", async (req, res) => {
  const tasks = await Task.find({ userId: req.params.userId });

  res.json(tasks);
});

// delete task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

// update task (for completion)
router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { completed },
    { new: true }
  );
  res.json(task);
});

module.exports = router;
