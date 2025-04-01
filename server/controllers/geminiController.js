require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Function to analyze job description or resume
const analyzeResume = async (req, res) => {
    try {
        const { jobDescription, roleLevel } = req.body;
        const resumeFile = req.file; // Handle uploaded resume

        console.log("🔹 Received Inputs:");
        console.log("👉 Job Description:", jobDescription);
        console.log("👉 Role Level:", roleLevel);
        console.log("👉 Resume File:", resumeFile ? "Uploaded" : "Not Provided");

        // Extract sections from resume (if uploaded)
        let resumeText = "";
        if (resumeFile) {
            resumeText = resumeFile.buffer.toString("utf-8");
        }

        // Extract details from resume text
        const careerObjective = extractCareerObjective(resumeText);
        const projects = extractProjects(resumeText);
        const skills = extractSkills(resumeText);
        const education = extractEducation(resumeText);
        const internship = extractInternship(resumeText);

        // Construct the prompt for Gemini AI
        let prompt = "Generate structured interview questions based on the following details:\n";
        if (careerObjective) prompt += `Career Objective: ${careerObjective}\n`;
        if (skills) prompt += `Skills: ${skills}\n`;
        if (projects) prompt += `Projects: ${projects}\n`;
        if (education) prompt += `Education: ${education}\n`;
        if (internship) prompt += `Internship Experience: ${internship}\n`;
        if (jobDescription) prompt += `Job Description: ${jobDescription}\n`;
        if (roleLevel) prompt += `Role Level: ${roleLevel}\n`;

        console.log("🔹 Generated Prompt:\n", prompt);

        // Initialize Gemini Model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5" });

        const result = await model.generateContent(prompt);
        console.log("✅ Gemini API Response Received.");

        // Validate API response format
        if (!result || !result.response || !result.response.candidates || !result.response.candidates[0].content.parts[0].text) {
            console.error("❌ Invalid response from Gemini API.");
            throw new Error("Gemini API returned an invalid response.");
        }

        // Extract generated questions
        const questions = result.response.candidates[0].content.parts[0].text
            .split("\n")
            .filter(q => q.trim() !== "");

        console.log("✅ Generated Questions:", questions);

        // Send response
        res.json({ success: true, questions });

    } catch (error) {
        console.error("❌ Gemini AI Error:", error.message);
        res.status(500).json({ success: false, error: "Failed to generate interview questions." });
    }
};

// ✅ Helper functions to extract key sections from the resume text
function extractCareerObjective(resumeText) {
    const match = resumeText.match(/Career Objective:(.*?)(\n|$)/s);
    return match ? match[1].trim() : "Not provided.";
}

function extractProjects(resumeText) {
    const match = resumeText.match(/Projects:(.*?)(\n|$)/s);
    return match ? match[1].trim() : "Not mentioned.";
}

function extractSkills(resumeText) {
    const match = resumeText.match(/Skills:(.*?)(\n|$)/s);
    return match ? match[1].trim() : "Not mentioned.";
}

function extractEducation(resumeText) {
    const match = resumeText.match(/Educational Qualifications:(.*?)(\n|$)/s);
    return match ? match[1].trim() : "Not provided.";
}

function extractInternship(resumeText) {
    const match = resumeText.match(/Internship:(.*?)(\n|$)/s);
    return match ? match[1].trim() : "Not mentioned.";
}

// ✅ Export function
module.exports = { analyzeResume };
