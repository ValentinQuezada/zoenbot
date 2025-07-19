"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchMongoose = exports.matchTypes = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
// Enum for match types
exports.matchTypes = [
    "group-regular",
    "round-of-16-regular",
    "round-of-16-extra",
    "quarterfinal-regular",
    "quarterfinal-extra",
    "semifinal-regular",
    "semifinal-extra",
    "final-regular",
    "final-extra",
];
// Zod schema for match creation
const createMatchSchema = zod_1.z.object({
    team1: zod_1.z.string(),
    team2: zod_1.z.string(),
    datetime: zod_1.z.date(),
    group: zod_1.z.string().length(1),
    matchType: zod_1.z.enum(exports.matchTypes),
    isFinished: zod_1.z.boolean().default(false),
    hasStarted: zod_1.z.boolean().default(false),
    specialHit: zod_1.z.boolean().default(false),
    lateGoalHit: zod_1.z.boolean().default(false),
    upsetHit: zod_1.z.boolean().default(false),
    fee: zod_1.z.number().min(0).max(20),
    statsAnnounced: zod_1.z.boolean().default(false)
});
// Zod schema for updating match score (only regular score now)
const updateMatchScoreSchema = zod_1.z.object({
    score: zod_1.z.object({
        team1: zod_1.z.number().min(0).max(100),
        team2: zod_1.z.number().min(0).max(100),
        advances: zod_1.z.enum(['team1', 'team2']).optional()
    }).optional(),
    specialHit: zod_1.z.boolean().default(false),
    lateGoalHit: zod_1.z.boolean().default(false),
    upsetHit: zod_1.z.boolean().default(false)
});
const MatchSchema = createMatchSchema.merge(updateMatchScoreSchema).extend({
    _id: zod_1.z.any()
});
// Mongoose schema for Match (no extraTimeScore or penaltyScore)
exports.MatchMongoose = new mongoose_1.Schema({
    team1: String,
    team2: String,
    datetime: Date,
    group: String,
    matchType: { type: String, enum: exports.matchTypes, required: true },
    score: {
        type: {
            team1: Number,
            team2: Number,
            advances: { type: String, enum: ["team1", "team2"], default: undefined }
        },
        default: undefined,
        _id: false,
    },
    isFinished: { type: Boolean, default: false },
    hasStarted: { type: Boolean, default: false },
    specialHit: { type: Boolean, default: false },
    lateGoalHit: { type: Boolean, default: false },
    upsetHit: { type: Boolean, default: false },
    fee: { type: Number, default: 5 },
    statsAnnounced: { type: Boolean, default: false }
}, {
    timestamps: true
});
