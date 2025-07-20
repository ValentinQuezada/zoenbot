import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/credentials";
import { SYSTEM_INSTRUCTIONS } from "./prompts";
import { ClubWorldCupTeams2025 } from "../config/teams";
import { GenContentResponse, ScorePredictionType, ScorePredictionSchema, TeamNameType, TeamNameSchema, ExtraScorePredictionSchema } from "./interfaces";
import { extractFromCodeblock } from "../utils/matcher";


const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY});
const modelName = "gemini-2.5-flash";

export async function identify(query:string) {
  const response = await ai.models.generateContent({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS.IDENTIFY,
      temperature: 0,
    },
    contents: "Este es el mensaje:" + query,
  });
  return response 
}

export async function chat(query: string, summary: string) {
  const response = await ai.models.generateContent({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS.CHAT(summary),
      temperature: 1.5,
    },
    contents: "Te acaban de taguear el siguiente mensaje: " + query,
  });
  
  return response 
}

export async function summarize(conversation: string) {
  const response = await ai.models.generateContent({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS.SUMMARIZE,
      temperature: 0.2,
      maxOutputTokens: 1500,
    },
    contents: conversation,
  });

  return response 
}

export async function mapTeamName(
  query: string
): Promise<GenContentResponse<TeamNameType>> {
  const response = await ai.models.generateContent({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS.TEAM_MAPPING,
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

export async function linkMatchScore(query: string, matches: [string, string][]): Promise<GenContentResponse<ScorePredictionType>> {
    const response = await ai.models.generateContent({
        model: modelName,
        config: {
            systemInstruction: SYSTEM_INSTRUCTIONS.FINAL_SCORE(
                matches.map(match => match.join(' vs. '))
            ),
            maxOutputTokens: 100,
            temperature: 0.1,
            responseMimeType: "application/json",
        },
        contents: query
    });

    if (response.text === undefined) {
        return {
            success: false,
            error: "Response text is undefined"
        }
    }

    try {
        const data = extractFromCodeblock(response.text);
        let jsonData = JSON.parse(data);
        if (Array.isArray(jsonData)) {
            jsonData = jsonData[0];
        }
        const parsedData = ScorePredictionSchema.parse(jsonData);

        const match = matches.find(
            match => match[0] === parsedData.team1 && match[1] === parsedData.team2 || match[0] === parsedData.team2 && match[1] === parsedData.team1
        );
        if (!match) {
            return {
                success: false,
                error: "​❌ No se encontró el partido. ¿Puedes ser un poco más exacto?"
            }
        }

        if (parsedData.team1 === match[1]) {
            parsedData.team1 = match[0];
            parsedData.team2 = match[1];
            parsedData.score.team1 = parsedData.score.team2;
            parsedData.score.team2 = parsedData.score.team1;
        }

        return {
            success: true,
            data: parsedData
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: `Invalid JSON ${e}`
        }
    }
}

export async function linkExtraTimeMatchScore(query: string, match: [string, string]): Promise<GenContentResponse<ScorePredictionType>> {
    const response = await ai.models.generateContent({
        model: modelName,
        config: {
            systemInstruction: SYSTEM_INSTRUCTIONS.MATCH_MAPPING_EXTRA_TIME(
                match.join(' vs. ')
            ),
            maxOutputTokens: 100,
            temperature: 0.1,
            responseMimeType: "application/json",
        },
        contents: query
    });

    if (response.text === undefined) {
        return {
            success: false,
            error: "Response text is undefined"
        }
    }

    try {
        const data = extractFromCodeblock(response.text);
        let jsonData = JSON.parse(data);
        if (Array.isArray(jsonData)) {
            jsonData = jsonData[0];
        }

        const parsedData = ExtraScorePredictionSchema.parse(jsonData);

        if (!match) {
            return {
                success: false,
                error: "​❌ No se encontró el partido. ¿Puedes ser un poco más exacto?"
            }
        }

        if (parsedData.team1 === match[1]) {
            parsedData.team1 = match[0];
            parsedData.team2 = match[1];
            parsedData.score.team1 = parsedData.score.team2;
            parsedData.score.team2 = parsedData.score.team1;
        }

        return {
            success: true,
            data: parsedData
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: `Invalid JSON ${e}`
        }
    }
}
