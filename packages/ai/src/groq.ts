import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY || "";

export const groq = new Groq(apiKey ? { apiKey } : {});

export const generateWithGroq = async (prompt: string, systemInstruction?: string) => {
  if (!apiKey) throw new Error("GROQ_API_KEY is not set.");

  const messages: any[] = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  const completion = await groq.chat.completions.create({
    messages,
    model: "llama3-8b-8192", // Fast open source model on Groq
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || "";
};
