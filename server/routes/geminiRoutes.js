const express = require("express");
const multer = require("multer");
const { analyzeResume } = require("../controllers/geminiController"); // ✅ Correct import

const router = express.Router();

// ✅ Multer for file upload (store in memory)
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Route for analyzing job description or resume
router.post("/mock-interview/analyze", upload.single("resume"), analyzeResume);

// ✅ Export router
module.exports = router;
