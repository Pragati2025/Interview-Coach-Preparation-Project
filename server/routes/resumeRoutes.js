const express = require("express");
const multer = require("multer");
const GeminiService = require('../services/geminiService');

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    const input = req.file ? req.file.buffer.toString("utf-8") : req.body.input;
    if (!input) {
      return res.status(400).json({ error: "No input provided" });
    }

    const response = await analyzeResume(input);
    res.json({ questions: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
