import dotenv from "dotenv";
dotenv.config();

console.log("🔑 Gemini API Key from env:", process.env.GEMINI_API_KEY);



import { GoogleGenerativeAI } from "@google/generative-ai";
import pkg from "pdf-parse";
const pdfParse = pkg.default || pkg;

import InterviewQA from "../models/InterviewQA.js";
import User from "../models/User.js";

// -------------------- INIT GEMINI --------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// -------------------- ANALYZE RESUME OR JD + GENERATE QUESTIONS AND ANSWERS --------------------
export const analyzeResumeOrJD = async (req, res) => {
  try {
    const { jobDescription, roleLevel = "N/A", userEmail } = req.body;
    const resumeFile = req.file;

    let resumeText = "";
    if (resumeFile && resumeFile.buffer) {
      const pdfData = await pdfParse(resumeFile.buffer);
      resumeText = pdfData.text;
    }

    const prompt = `
You are an AI Interview Coach. Based on the following resume and job description, generate 8-10 interview question-answer pairs. Include both technical and behavioral questions. Format response as:

Q: <Question>
A: <Model Answer>

Resume:
${resumeText || "N/A"}

Job Description:
${jobDescription || "N/A"}
`;

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse QA pairs
    const qaPairs = [];
    const lines = response.split("\n");

    let currentQuestion = "";
    let currentAnswer = "";

    lines.forEach((line) => {
      line = line.trim();

      if (/^Q[:：]/i.test(line)) {
        if (currentQuestion && currentAnswer) {
          qaPairs.push({ question: currentQuestion, answer: currentAnswer });
          currentAnswer = "";
        }
        currentQuestion = line.replace(/^Q[:：]\s*/i, "");
      } else if (/^A[:：]/i.test(line)) {
        currentAnswer = line.replace(/^A[:：]\s*/i, "");
      } else if (currentAnswer !== "") {
        currentAnswer += " " + line; // multi-line answers
      }
    });

    // Push last one
    if (currentQuestion && currentAnswer) {
      qaPairs.push({ question: currentQuestion, answer: currentAnswer });
    }

    return res.status(200).json({ qaPairs });
  } catch (error) {
    console.error("❌ Gemini Analysis Error:", error);
    return res.status(500).json({ error: "Error generating questions and answers" });
  }
};

// -------------------- ANALYZE RESUME (Manual Only - Optional) --------------------
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const resume = req.file;
    const parsedResume = await pdfParse(resume.buffer);
    console.log(parsedResume.text);

    const questions = await generateInterviewQuestions(req.body.jobDescription);

    return res.json({ questions });
  } catch (error) {
    console.error("❌ Error during resume analysis:", error);
    res.status(500).json({ error: "Something went wrong during resume analysis" });
  }
};

// -------------------- SUBMIT USER ANSWERS ----------------------
export const submitQA = async (req, res) => {
  const { email, qaPairs } = req.body;

  if (!email || !qaPairs) {
    return res.status(400).json({ error: "Email and questions with answers are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await InterviewQA.create({
      userEmail: email,
      qaPairs,
    });

    return res.status(200).json({ success: true, message: "Answers submitted successfully." });
  } catch (err) {
    console.error("❌ Error saving interview:", err);
    res.status(500).json({ error: "Failed to save interview" });
  }
};
