import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/credentials";
import { SYSTEM_INSTRUCTIONS } from "./prompts";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY});
const modelName = "gemini-2.5-flash";

export async function chat(query: string) {
  const response = await ai.models.generateContent({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS.CHAT,
      temperature: 1.5,
    },
    contents: query,
  });

  return response 
}