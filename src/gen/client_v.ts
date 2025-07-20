import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/credentials";
import { SYSTEM_INSTRUCTIONS } from "./prompts";
import { GenContentResponse, ScorePredictionType, ScorePredictionSchema, TeamNameType, TeamNameSchema } from "./interfaces";
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

export async function mapTeamName(query: string): Promise<GenContentResponse<TeamNameType>> {
  const response = await ai.models.generateContent({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS.TEAM_MAPPING(list),
      maxOutputTokens: 100,
      temperature: 0.1,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          team: {
            type: "string",
            enum: ClubWorldCupTeams2025
          }
        },
        required: ["team"]
      }
    },
    contents: `Identifica el equipo de fútbol mencionado en: "${query}"`
  });

  if (!response.text) {
    return { success: false, error: "No response text" };
  }

  try {
    const data = extractFromCodeblock(response.text);
    const jsonData = JSON.parse(data);
    const parsedData = TeamNameSchema.parse(jsonData);
    
    return {
      success: true,
      data: parsedData
    };
  } catch (e) {
    console.error("Error mapping team name:", e);
    return {
      success: false,
      error: `Invalid team mapping: ${e instanceof Error ? e.message : e}`
    };
  }
}