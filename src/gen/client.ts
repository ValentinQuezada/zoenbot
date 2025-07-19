import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY});
const modelName = "gemini-2.5-flash";

export async function answer(query: string) {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: query,
  });
  console.log(response.text);
}
