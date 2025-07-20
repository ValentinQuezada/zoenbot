"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamNameSchema = exports.ExtraScorePredictionSchema = exports.ScorePredictionSchema = void 0;
const zod_1 = require("zod");
const teams_1 = require("../config/teams");
exports.ScorePredictionSchema = zod_1.z.object({
    team1: zod_1.z.string(),
    team2: zod_1.z.string(),
    score: zod_1.z.object({
        team1: zod_1.z.number(),
        team2: zod_1.z.number()
    }),
    advances: zod_1.z.enum(["team1", "team2"]).optional()
});
exports.ExtraScorePredictionSchema = exports.ScorePredictionSchema.transform(data => {
    if (data.advances === undefined) {
        return Object.assign(Object.assign({}, data), { advances: (data.score.team1 > data.score.team2 ? "team1" : "team2") });
    }
    return data;
});
exports.TeamNameSchema = zod_1.z.object({
    team: zod_1.z.enum([...teams_1.ClubWorldCupTeams2025])
});
