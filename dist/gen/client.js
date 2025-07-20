"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = chat;
exports.summarize = summarize;
exports.mapTeamName = mapTeamName;
const genai_1 = require("@google/genai");
const credentials_1 = require("../config/credentials");
const prompts_1 = require("./prompts");
const teams_1 = require("../config/teams");
const interfaces_1 = require("./interfaces");
const matcher_1 = require("../utils/matcher");
const ai = new genai_1.GoogleGenAI({ apiKey: credentials_1.GEMINI_API_KEY });
const modelName = "gemini-2.5-flash";
function chat(query, summary) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield ai.models.generateContent({
            model: modelName,
            config: {
                systemInstruction: prompts_1.SYSTEM_INSTRUCTIONS.CHAT(summary),
                temperature: 1.5,
            },
            contents: "Te acaban de taguear el siguiente mensaje: " + query,
        });
        return response;
    });
}
function summarize(conversation) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield ai.models.generateContent({
            model: modelName,
            config: {
                systemInstruction: prompts_1.SYSTEM_INSTRUCTIONS.SUMMARIZE,
                temperature: 0.2,
                maxOutputTokens: 1500,
            },
            contents: conversation,
        });
        return response;
    });
}
function mapTeamName(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield ai.models.generateContent({
            model: modelName,
            config: {
                systemInstruction: prompts_1.SYSTEM_INSTRUCTIONS.TEAM_MAPPING,
                maxOutputTokens: 100,
                temperature: 0.1,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        team: {
                            type: "string",
                            enum: teams_1.ClubWorldCupTeams2025
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
            const data = (0, matcher_1.extractFromCodeblock)(response.text);
            const jsonData = JSON.parse(data);
            const parsedData = interfaces_1.TeamNameSchema.parse(jsonData);
            return {
                success: true,
                data: parsedData
            };
        }
        catch (e) {
            console.error("Error mapping team name:", e);
            return {
                success: false,
                error: `Invalid team mapping: ${e instanceof Error ? e.message : e}`
            };
        }
    });
}
