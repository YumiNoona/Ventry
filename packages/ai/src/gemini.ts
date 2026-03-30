import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

// Suppress init if no key is present during build time
export const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

export const generateWithGemini = async (prompt: string, systemInstruction?: string) => {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
};
