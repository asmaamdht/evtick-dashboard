import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   EVENT DESCRIPTION
========================= */
app.post("/ai/description", async (req, res) => {
  const { title, category, date, location } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional event copywriter." },
        {
          role: "user",
          content: `
Write a short engaging description for an event.
Title: ${title}
Category: ${category}
Date: ${date}
Location: ${location}

Constraints:
1. Maximum 90 tokens.
2. Do NOT use markdown bolding (do not use **).
3. Plain text only.
`
        }
      ],
    });

    res.json({ text: response.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   HASHTAGS
========================= */
app.post("/ai/hashtags", async (req, res) => {
  const { title } = req.body;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: `Generate social media hashtags for: ${title}` }
    ],
  });

  res.json({ text: response.choices[0].message.content });
});

/* =========================
   SOCIAL POST
========================= */
app.post("/ai/social", async (req, res) => {
  const { title, date, location } = req.body;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
Create a catchy social media post.
Event: ${title}
Date: ${date}
Location: ${location}
Use emojis and CTA.
`
      }
    ],
  });

  res.json({ text: response.choices[0].message.content });
});

/* =========================
   POSTER (IMAGE)
========================= */
app.post("/ai/poster", async (req, res) => {
  const { title, category, date, location } = req.body;

  const prompt = `
Professional event poster design.
Main title: "${title}"
Category: ${category || "event"}
Date: ${date || "Coming Soon"}
Location: ${location || "Main Venue"}

Style:
Modern, cinematic lighting, clean typography,
high contrast, dark background,
NO logos, NO watermark, NO blur.
`;

  try {
    const image = await client.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
    });

    res.json({ image: image.data[0].url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   NAVBAR CHATBOT
========================= */
app.post("/ai/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant. Keep your response extremely short (under 20 tokens)." },
        { role: "user", content: message }
      ],
      max_tokens: 20,
    });

    res.json({ text: response.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.listen(process.env.PORT, () =>
  console.log(`🔥 AI Server running on port ${process.env.PORT}`)
);
