"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PredictionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    matchId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Match" },
    prediction: {
        team1: { type: Number, required: true },
        team2: { type: Number, required: true },
        advances: { type: String, enum: ["team1", "team2"], default: undefined }
    },
    isWinner: { type: Boolean, default: false },
    auraGiven: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    allowedToBet: [{ type: String }]
});
