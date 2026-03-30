import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

// Initialize if key is present
export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateWithGemini = async (prompt: string, systemInstruction?: string) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not set.");
  
  // Using 1.5 Flash as requested for high-speed generation
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction 
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

