import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON parsing with higher limit for base64 image data
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI-Powered Neural Style Transfer generation endpoint
  app.post("/api/style-transfer/ai-generate", async (req, res) => {
    try {
      const { contentImageBase64, styleImageBase64, styleName, stylePrompt, intensity = 0.85 } = req.body;

      if (!contentImageBase64) {
        return res.status(400).json({ error: "Content image is required" });
      }

      // Clean base64 strings
      const cleanContentData = contentImageBase64.replace(/^data:image\/\w+;base64,/, "");
      const cleanStyleData = styleImageBase64 ? styleImageBase64.replace(/^data:image\/\w+;base64,/, "") : null;

      const promptText = `You are an expert Neural Style Transfer model. 
Task: Perform high-fidelity neural style transfer. Take the subject, geometry, and composition of the content image, and re-render it completely in the artistic style, brushstrokes, color palette, lighting, texture, and medium of ${styleName || "the provided reference artwork"}.
${stylePrompt ? `Specific artistic style cues: ${stylePrompt}.` : ""}
Neural style transfer intensity: ${(intensity * 100).toFixed(0)}%.
Maintain the structural edges and recognizable elements of the content image while thoroughly infusing the painterly textures, brush stroke dynamics, canvas grain, and chromatic harmonies of the artistic style.`;

      const parts: any[] = [];
      
      // Add content image
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: cleanContentData,
        },
      });

      // Add style image if present
      if (cleanStyleData) {
        parts.push({
          inlineData: {
            mimeType: "image/png",
            data: cleanStyleData,
          },
        });
      }

      parts.push({
        text: promptText,
      });

      // Try image generation model first
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: { parts },
      });

      let generatedImageUrl: string | null = null;
      let textExplanation = "";

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            generatedImageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
          } else if (part.text) {
            textExplanation += part.text;
          }
        }
      }

      if (generatedImageUrl) {
        return res.json({
          success: true,
          imageUrl: generatedImageUrl,
          notes: textExplanation || "Neural style transfer successfully synthesized.",
        });
      } else {
        return res.json({
          success: false,
          fallbackReason: "Model returned text analysis instead of image",
          text: textExplanation,
        });
      }
    } catch (err: any) {
      console.error("AI Style Transfer error:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate AI stylized image",
      });
    }
  });

  // Artistic Style Critic & Neural Feature Analysis endpoint using Gemini 3.7 Flash
  app.post("/api/style-transfer/analyze", async (req, res) => {
    try {
      const { contentImageBase64, styleImageBase64, styleName } = req.body;

      if (!contentImageBase64 || !styleImageBase64) {
        return res.status(400).json({ error: "Both content and style images are required for analysis" });
      }

      const cleanContent = contentImageBase64.replace(/^data:image\/\w+;base64,/, "");
      const cleanStyle = styleImageBase64.replace(/^data:image\/\w+;base64,/, "");

      const prompt = `Perform a deep Neural Style Transfer breakdown and artistic feature analysis for:
Style Artwork: "${styleName || "Reference Artwork"}"
Compare how the neural network represents content features (VGG conv4_2 / conv5_2 feature maps) versus style Gram matrices (Gram matrices across conv1_1, conv2_1, conv3_1, conv4_1, conv5_1).

Return your response in clean JSON format with these exact keys:
{
  "artisticMovement": "e.g., Post-Impressionism / Cubism / Ukiyo-e",
  "dominantPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "paletteNames": ["e.g. Cobalt Blue", "Cadmium Yellow", "Raw Umber", "Zinc White", "Lamp Black"],
  "brushstrokeCharacteristics": "Description of brush stroke rhythm, impasto thickness, and directional flow",
  "textureGramMatrixSummary": "Description of spatial correlation of feature representations (textures, swirls, sharp geometric edges)",
  "recommendedSettings": {
    "styleWeight": "high | medium | balanced",
    "strokeScale": "fine | medium | bold",
    "colorPreservation": "style_dominant | content_dominant | balanced_harmony",
    "explanation": "Why these settings yield the optimal neural loss convergence"
  },
  "artHistoricalContext": "Brief 2-sentence context on the artist and technique"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: {
          parts: [
            { inlineData: { mimeType: "image/png", data: cleanContent } },
            { inlineData: { mimeType: "image/png", data: cleanStyle } },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const analysisData = JSON.parse(responseText.trim());
      return res.json({ success: true, analysis: analysisData });
    } catch (err: any) {
      console.error("Style Analysis error:", err);
      return res.status(500).json({ error: err.message || "Failed to analyze neural features" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Neural Style Transfer server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
