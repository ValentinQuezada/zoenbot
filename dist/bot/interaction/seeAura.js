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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const aura_1 = require("../../schemas/aura");
const connections_1 = __importDefault(require("../../database/connections"));
const auraPointsValues_1 = require("../../config/auraPointsValues");
const seeAuraCommand = {
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, connections_1.default)();
            const AuraPoints = mongoose_1.default.model("AuraPoints", aura_1.AuraPointsSchema);
            // sorts the leaderboard by totalPoints in descending order
            const leaderboard = yield AuraPoints.find({}).sort({ totalPoints: -1 }).lean();
            // let lastRank = leaderboard.findIndex(row => row.userId === interaction.user.id) as number;
            // lastRank += 1;
            let lastPoints = null;
            let lastRank = 0;
            for (let idx = 0; idx < leaderboard.length; idx++) {
                const row = leaderboard[idx];
                if (lastPoints != row.totalPoints) {
                    lastRank = idx + 1;
                    lastPoints = row.totalPoints;
                }
                if (row.userId === interaction.user.id)
                    break;
            }
            const userAura = leaderboard.find(row => row.userId === interaction.user.id);
            if (userAura) {
                let privateMessage = `🔎 **Tus Aura Points (💠) por atributo:**\n`;
                auraPointsValues_1.ATTRIBUTES.forEach(attr => {
                    var _a;
                    if (attr.key !== "totalPoints") {
                        privateMessage += `${attr.label} **${attr.name}:** ${(_a = userAura[attr.key]) !== null && _a !== void 0 ? _a : 0} 💠`;
                    }
                    if (attr.key == "matchesHit" || attr.key == "uniqueHit" || attr.key == "specialHit" || attr.key == "lateGoalHit" || attr.key == "upsetHit") {
                        privateMessage += ` (${auraPointsValues_1.AURA_POINTS_VALUES[attr.key]} por hit)`;
                    }
                    else if (attr.key == "streak3plus") {
                        privateMessage += ` (${auraPointsValues_1.AURA_POINTS_VALUES[attr.key]} por racha acumulada)`;
                    }
                    else if (attr.key == "awardHit") {
                        privateMessage += ` (${auraPointsValues_1.AURA_POINTS_VALUES[attr.key]} por award)`;
                    }
                    else if (attr.key == "recordHit") {
                        privateMessage += ` (${auraPointsValues_1.AURA_POINTS_VALUES[attr.key]} por récord)`;
                    }
                    privateMessage += `\n`;
                });
                privateMessage += `💠 **TOTALES: ${userAura.totalPoints}** Aura Points\n`;
                privateMessage += `📊​ Ranking: ${lastRank}/${leaderboard.length}`;
                yield interaction.reply({ content: privateMessage, ephemeral: true });
            }
            else {
                yield interaction.reply({ content: "📂​ No hay datos de **Aura Points** aún." });
                return;
            }
        });
    }
};
const seeAura_simple = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, replyFn }) {
    yield (0, connections_1.default)();
    const AuraPoints = mongoose_1.default.model("AuraPoints", aura_1.AuraPointsSchema);
    // sorts the leaderboard by totalPoints in descending order
    const leaderboard = yield AuraPoints.find({}).sort({ totalPoints: -1 }).lean();
    let lastPoints = null;
    let lastRank = 0;
    for (let idx = 0; idx < leaderboard.length; idx++) {
        const row = leaderboard[idx];
        if (lastPoints != row.totalPoints) {
            lastRank = idx + 1;
            lastPoints = row.totalPoints;
        }
        if (row.userId === userId)
            break;
    }
    const userAura = leaderboard.find(row => row.userId === userId);
    if (userAura) {
        let privateMessage = `🔎 **Tus Aura Points (💠) por atributo:**\n`;
        auraPointsValues_1.ATTRIBUTES.forEach(attr => {
            var _a;
            if (attr.key !== "totalPoints") {
                privateMessage += `${attr.label} **${attr.name}:** ${(_a = userAura[attr.key]) !== null && _a !== void 0 ? _a : 0} 💠`;
            }
            if (attr.key == "matchesHit" || attr.key == "uniqueHit" || attr.key == "specialHit" || attr.key == "lateGoalHit" || attr.key == "upsetHit") {
                privateMessage += ` (${auraPointsValues_1.AURA_POINTS_VALUES[attr.key]} por hit)`;
            }
            else if (attr.key == "streak3plus") {
                privateMessage += ` (${auraPointsValues_1.AURA_POINTS_VALUES[attr.key]} por racha acumulada)`;
            }
            else if (attr.key == "awardHit") {
                privateMessage += ` (${auraPointsValues_1.AURA_POINTS_VALUES[attr.key]} por award)`;
            }
            else if (attr.key == "recordHit") {
                privateMessage += ` (${auraPointsValues_1.AURA_POINTS_VALUES[attr.key]} por récord)`;
            }
            privateMessage += `\n`;
        });
        privateMessage += `💠 **TOTALES: ${userAura.totalPoints}** Aura Points\n`;
        privateMessage += `📊​ Ranking: ${lastRank}/${leaderboard.length}`;
        yield replyFn(privateMessage);
    }
    else {
        yield replyFn("📂​ No hay datos de **Aura Points** aún.");
        return;
    }
});
exports.default = { seeAuraCommand, seeAura_simple };
