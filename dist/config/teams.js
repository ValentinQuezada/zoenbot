"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubWorldCupTeams2025 = void 0;
const teams_json_1 = __importDefault(require("../../data/teams.json"));
exports.ClubWorldCupTeams2025 = teams_json_1.default.map((team) => `${team.name} (${team.alias})`);
