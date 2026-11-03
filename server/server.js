const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Gemini AI setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Home route
app.get("/", (req, res) => {
  res.send("MindSaathi Backend is Running!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MindSaathi API is working!",
  });
});

// Gemini Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Gemini API key is missing",
      });
    }

    const selectedLanguage =
      language === "en" ? "English" : "Marathi";

    const prompt = `
You are Sathi, a friendly AI companion for elderly people.

Talk like a caring and patient friend.
Reply only in ${selectedLanguage}.
Use simple, warm and short sentences.
Be supportive and respectful.
Never diagnose diseases.
Never recommend changing medicines.
For serious health concerns, suggest contacting a doctor or caregiver.

User message: ${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    res.json({
      success: true,
      reply: response.text,
    });

  } catch (error) {
    console.error("Gemini API Error:", error.message);

    res.status(500).json({
      success: false,
      error: "Unable to get AI response. Please try again.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`MindSaathi server running on port ${PORT}`);
});