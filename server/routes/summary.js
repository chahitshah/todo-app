const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const Summary = require("../models/Summary");
const Task = require("../models/Task");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate Daily Summary with Groq
router.post("/generate", async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch all completed tasks for the user
    const tasks = await Task.find({
      userId,
      completed: true
    });

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

// Get Summary History
router.get("/history/:userId", async (req, res) => {
  try {
    const summaries = await Summary.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
