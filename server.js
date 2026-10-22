
const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const ai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.post("/api/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "The AI API key is not configured yet."
      });
    }

    const message = req.body.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    const response = await ai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions:
        "You are NEXUS 4 AI, a friendly, helpful assistant. Answer clearly and honestly. If you do not know something, say so.",
      input: message.trim()
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("AI request failed:", error.message);
    res.status(500).json({
      error: "The AI could not respond. Check the server terminal and API setup."
    });
  }
});

app.listen(PORT, () => {
  console.log(`NEXUS 4 AI running at http://localhost:${PORT}`);
});
