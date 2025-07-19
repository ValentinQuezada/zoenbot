"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserStatsSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true },
    totalPredictions: { type: Number, default: 0 },
    correctPredictions: { type: Number, default: 0 },
    incorrectPredictions: { type: Number, default: 0 },
    noWinnersPredictions: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    loss: { type: Number, default: 0 },
    gain: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    onlyGroupStage: { type: Boolean, default: true },
    missedNonGroupPredictions: { type: Number, default: 0 },
    auraPoints: { type: Number, default: 0 }
});
