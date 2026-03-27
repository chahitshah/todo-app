const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// get tasks with pagination (Secured)
router.get("/:userId", auth, async (req, res) => {
  try {
    // Basic security check
    if (req.user !== req.params.userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const { page = 1, limit = 10 } = req.query;
    const tasks = await Task.find({ userId: req.params.userId })
      .sort({ dueDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Task.countDocuments({ userId: req.params.userId });
    
    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalTasks: count
    });
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// delete task (Secured)
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json("Task not found");
    
    // Check user
    if (task.userId.toString() !== req.user) {
      return res.status(401).json("User not authorized");
    }

    await task.deleteOne();
    res.json("Deleted");
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// update task (Secured)
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json("Task not found");

    // Check user
    if (task.userId.toString() !== req.user) {
      return res.status(401).json("User not authorized");
    }

    const { title, description, dueDate, priority, completed } = req.body;
    
    // Perform update
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, priority, completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// add task (Secured)
router.post("/add", auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority, userId } = req.body;
    
    // Safety check
    if (req.user !== userId) {
      return res.status(401).json("Unauthorized action");
    }

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

module.exports = router;
