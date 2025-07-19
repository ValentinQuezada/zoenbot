import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/credentials";
import { SYSTEM_INSTRUCTIONS } from "./prompts";
import { contextMap } from "../index";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY});
const modelName = "gemini-2.5-flash";

export async function chat(query: string, summary: string) {
  const response = await ai.models.generateContent({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS.CHAT(summary),
      temperature: 1.5,
    },
    contents: "Te acaban de taguear el siguiente mensaje: " + query,
  });
  console.log(response.text);
}

export async function summarize(channel: string) {
  const channelContext = contextMap.get(channel)!;
  const conversation = channelContext.map(m => `${m.author.username}: ${m.content}`).join('\n');

  const response = await ai.models.generateContent({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS.SUMMARIZE,
      temperature: 1.5,
    },
    contents: conversation,
  });

  return response 
}