const pdfParse = require("pdf-parse");
const axios = require("axios");

const generateInterviewQuestions = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        // Extract text from PDF
        const dataBuffer = req.file.buffer;
        const pdfData = await pdfParse(dataBuffer);
        const extractedText = pdfData.text;

        if (!extractedText || extractedText.trim() === "") {
            throw new Error("Failed to extract text from PDF. Try another format.");
        }

        console.log("Extracted Resume Text:", extractedText);

        // Send extracted text to Gemini API
        const apiResponse = await axios.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText",
            {
                prompt: extractedText,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
                },
            }
        );

        if (!apiResponse.data || !apiResponse.data.candidates) {
            throw new Error("AI response is empty. Check API request.");
        }

        console.log("Generated Questions:", apiResponse.data);

        res.json({ questions: apiResponse.data.candidates });

    } catch (error) {
        console.error("Error in Question Generation:", error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { generateInterviewQuestions };
