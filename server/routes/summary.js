const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const Summary = require("../models/Summary");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate Daily Summary with Groq (Secured)
router.post("/generate", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Security check
    if (req.user !== userId) {
       return res.status(401).json({ error: "Unauthorized action" });
    }

    // Fetch all completed tasks for the user
    const tasks = await Task.find({
      userId,
      completed: true
    });
// ... and so on


    if (tasks.length === 0) {
      return res.status(400).json({ error: "No completed tasks to summarize. Mark some tasks as done first!" });
    }

    const taskList = tasks.map(t => `- ${t.title}: ${t.description || "No description"}`).join("\n");

    const prompt = `Summarize the following tasks I completed today in a professional and encouraging way:
${taskList}

Keep it concise, highlight the main achievements, and use a friendly tone.`;

    let summaryText = "";

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
      });
      summaryText = chatCompletion.choices[0].message.content;
    } catch (err) {
      console.error("Groq API Error:", err.message);
      // Fallback
      summaryText = `[AI Feature Status: Demo Mode - Groq API Error]\n\nToday was a productive day! You successfully tackled ${tasks.length} task(s). 

Key Highlights:
${tasks.slice(0, 3).map(t => `✅ Finished "${t.title}"`).join("\n")}

Keep up the great momentum!`;
    }

    const newSummary = await Summary.create({
      text: summaryText,
      userId
    });

    res.json(newSummary);
  } catch (err) {
    console.error("AI Summary Error:", err);
    res.status(500).json({ error: "Failed to generate summary. " + err.message });
  }
});

// Get Summary History (Secured)
router.get("/history/:userId", auth, async (req, res) => {
  try {
    if (req.user !== req.params.userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const summaries = await Summary.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete a specific summary (Secured)
router.delete("/:id", auth, async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    if (!summary) return res.status(404).json({ error: "Summary not found." });
    
    if (summary.userId.toString() !== req.user) {
      return res.status(401).json({ error: "Unauthorized action" });
    }

    await summary.deleteOne();
    res.json({ message: "Summary deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
