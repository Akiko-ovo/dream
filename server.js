require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ 用新版 OpenAI SDK 方式初始化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/interpret", async (req, res) => {
  try {
    const { dream } = req.body;
    if (!dream) {
      return res.status(400).json({ error: "No dream text provided." });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in dream interpretation based on evolutionary biology and psychology.",
        },
        { role: "user", content: dream },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    res.json({ interpretation: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error interpreting dream:", error);
    res.status(500).json({ error: "Error generating interpretation." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
