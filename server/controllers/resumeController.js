const fs = require('fs');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const analyzeResume = async (req, res) => {
  try {
    console.log('➡️ Request Received:', req.body); // ✅ Debugging request

    let input = '';

    // ✅ Extract text from PDF or input
    if (req.file) {
      console.log('✅ Received file:', req.file.originalname);
      const data = await pdfParse(req.file.buffer);
      input = data.text;
    } else if (req.body.input) {
      input = req.body.input;
    } else {
      return res.status(400).json({ error: 'No input provided' });
    }

    if (!input) {
      throw new Error('Failed to extract text from input');
    }

    console.log('✅ Extracted input:', input);

    // ✅ Prepare prompt for technical and behavioral questions
    const prompt = `
      Based on the following resume or input, generate 10 interview questions:
      - If the candidate is from a technical background:
        - Generate 5 technical questions related to their mentioned skills, projects, and technologies.
        - Generate 5 behavioral questions to assess problem-solving, teamwork, and communication skills.
      - If the candidate is from a non-technical background:
        - Generate 5 general questions about the input content.

      Input:
      ${input}

      Only return the questions in a numbered list. No extra text or explanation.
    `;

    // ✅ Generate questions using Gemini
    const result = await model.generateContent(prompt);
    console.log('➡️ Gemini Raw Response:', result);

    const response = result.response;
    if (!response) {
      throw new Error('Failed to get response from Gemini');
    }

    const questions = response.text().split('\n').filter(q => q.trim() !== '');
    if (questions.length === 0) {
      throw new Error('Failed to generate questions');
    }

    console.log('✅ Generated Questions:', questions);

    // ✅ Send back only questions
    res.status(200).json({
      questions: questions.map(q => q.replace(/^\d+\.\s*/, '')) // Remove numbering
    });
  } catch (error) {
    console.error('❌ Error analyzing resume:', error.message);
    res.status(500).json({ error: 'Failed to analyze resume', details: error.message });
  }
};

module.exports = { analyzeResume };
