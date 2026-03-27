const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
  userId: String
});

module.exports = mongoose.model("Summary", summarySchema);
