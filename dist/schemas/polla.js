"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polla = exports.PollaMongoose = void 0;
const mongoose_1 = require("mongoose");
const TeamSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    alias: { type: String, required: true }
}, { _id: false });
exports.PollaMongoose = new mongoose_1.Schema({
    name: { type: String, required: true },
    teams: { type: [TeamSchema], required: true },
    matches: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Match', required: true }],
    users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['open', 'closed', 'in_progress'], default: 'open' }
}, {
    timestamps: true
});
exports.Polla = (0, mongoose_1.model)("Polla", exports.PollaMongoose);
