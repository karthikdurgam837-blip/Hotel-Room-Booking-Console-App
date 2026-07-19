import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limits for base64 room images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize the Google Gen AI client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is missing.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper to convert base64 image URL to the format required by @google/genai
function parseBase64Image(dataUrl: string) {
  const matches = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 image data format");
  }
  return {
    mimeType: matches[1],
    data: matches[2],
  };
}

// 1. Analyze Room Photo Endpoint
app.post("/api/analyze-room", async (req, res) => {
  try {
    const { image, roomType, challenges, style } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing image data" });
    }

    const { mimeType, data: base64Data } = parseBase64Image(image);

    const prompt = `
You are a world-class professional home organizer, interior declutterer, and spatial designer.
Analyze this photo of a user's ${roomType || "room"} and generate a detailed, highly practical, and compassionate decluttering and organization plan.

The user's primary challenges in this space are: ${challenges && challenges.length > 0 ? challenges.join(", ") : "general clutter and disorganization"}.
The user's aesthetic and functional style goal is: ${style || "organized, clean, and warm"}.

You MUST return a JSON object that strictly adheres to the following structure:
{
  "roomType": "The analyzed room type",
  "organizationScore": An integer rating from 1 to 10 of the current organization state (1 being extremely cluttered/unusable, 10 being perfectly pristine),
  "clutterAnalysis": "A friendly, empathetic 2-3 sentence summary of what is causing clutter, what is working well, and what is dragging the space down based on the visual evidence.",
  "quickWins": [
    "A list of 3-4 ultra-fast tasks (taking 5-10 minutes each) that will immediately make a visible difference and build momentum."
  ],
  "actionPlan": [
    {
      "step": 1,
      "title": "Clear, direct title of the step",
      "description": "Specific, actionable instructions on what to sort, throw away, donate, or reorganize for this step."
    }
  ],
  "storageSolutions": [
    {
      "solution": "Name of a specific organizational tool or storage type (e.g., woven baskets, vertical floating shelves, clear storage bins)",
      "benefit": "Why this specific tool solves a challenge visible in the photo."
    }
  ],
  "layoutSuggestions": "A friendly, 2-3 sentence suggestion on furniture layout, spatial flow, lighting, or orientation to make the room feel larger, more balanced, and welcoming."
}

Generate exactly 4-5 steps in the actionPlan. Ensure the steps are sequential and progress from initial sorting to deep organizing and final styling.
Be encouraging and compassionate. Avoid using harsh words like "messy", "hoarder", or "dirty" — refer instead to "clutter", "spatial overflow", "surface volume", or "untapped storage opportunities".
Return ONLY the JSON object, with no markdown formatting or blockquotes around the JSON.
`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: prompt,
    };

    // Call gemini-3.1-pro-preview as explicitly required in instructions
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No text content returned from Gemini");
    }

    // Parse the JSON output
    const cleanJson = resultText.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
    const analysisResult = JSON.parse(cleanJson);

    return res.json(analysisResult);
  } catch (error: any) {
    console.error("Error analyzing room:", error);
    return res.status(500).json({
      error: "Failed to analyze image. Please ensure the image is clear and try again.",
      details: error.message,
    });
  }
});

// 2. Chatbot Coach Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, roomContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message parameter" });
    }

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    // Inject room context directly into the system instruction
    let systemInstruction = `
You are "Aura", a warm, empathetic, and expert personal decluttering coach and home organizer.
Your goal is to guide the user in organizing their living spaces, breaking down daunting tasks into manageable steps, overcoming emotional attachments to clutter, and discovering smart storage tips.
You are professional, patient, and speak with a calm, styling-expert voice. Use emojis sparingly but warmly.
`;

    if (roomContext) {
      systemInstruction += `
Currently, you are assisting the user with their ${roomContext.roomType || "room"}, which has been analyzed by your vision system.
Here are the analyzed details of their room to help ground your conversation:
- Current Organization Score: ${roomContext.organizationScore}/10
- Clutter Observations: ${roomContext.clutterAnalysis}
- Quick Wins suggested: ${roomContext.quickWins ? roomContext.quickWins.join("; ") : ""}
- Layout advice: ${roomContext.layoutSuggestions}

Refer to these specific details naturally when the user asks questions about their room, how to execute the plan, or what products to use. Be their partner in making this space beautiful!
`;
    }

    const chat = ai.chats.create({
      model: "gemini-3.5-flash", // Use gemini-3.5-flash as requested in text block for general tasks
      history: formattedHistory,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const response = await chat.sendMessage({ message: message });
    const replyText = response.text;

    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({
      error: "Something went wrong in our conversation. Please try sending your message again.",
      details: error.message,
    });
  }
});

// Vite Integration and Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
