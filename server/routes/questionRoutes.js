const express = require("express");
const multer = require("multer");
const { generateInterviewQuestions } = require("../controllers/questionController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

router.post("/generate-questions", upload.single("resume"), generateInterviewQuestions);

module.exports = router;
