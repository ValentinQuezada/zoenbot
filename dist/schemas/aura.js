"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuraPointsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AuraPointsSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true },
    matchesHit: { type: Number, default: 0 },
    uniqueHit: { type: Number, default: 0 },
    specialHit: { type: Number, default: 0 },
    lateGoalHit: { type: Number, default: 0 },
    upsetHit: { type: Number, default: 0 },
    streak3plus: { type: Number, default: 0 },
    topProfit: { type: Number, default: 0 },
    topWinRate: { type: Number, default: 0 },
    topStreak: { type: Number, default: 0 },
    awardHit: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 }
});
