import { generateWithGemini } from "./gemini";
import { generateWithGroq } from "./groq";
import { replySystemInstruction } from "./prompts/reply";
import { postSystemInstruction } from "./prompts/post";

export type GenerationIntent = "reply" | "post";

export const generateContent = async (intent: GenerationIntent, payload: any) => {
  if (intent === "reply") {
    // Fast latency required
    const prompt = `Context: ${JSON.stringify(payload)}`;
    return await generateWithGroq(prompt, replySystemInstruction);
  } else if (intent === "post") {
    // High reasoning/generation required
    const prompt = `Topic and keywords: ${JSON.stringify(payload)}`;
    return await generateWithGemini(prompt, postSystemInstruction);
  }
  
  throw new Error("Invalid intent for AI generation.");
};
