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
const connections_1 = __importDefault(require("../../database/connections"));
const prediction_1 = require("../../schemas/prediction");
const timestamp_1 = require("../../utils/timestamp");
const sup_1 = require("../../utils/sup");
const seeMatches = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    yield interaction.deferReply({ ephemeral: true });
    const db = yield (0, connections_1.default)();
    const Match = db.model("Match");
    const Prediction = db.model("Prediction", prediction_1.PredictionSchema);
    // search for all matches that are not finished
    let matchFilter = { isFinished: false };
    const matches = yield Match.find(matchFilter);
    // search for all predictions of the user
    const predictions = yield Prediction.find({ userId: interaction.user.id });
    const predictedMatchIds = new Set(predictions.map(p => p.matchId.toString()));
    // filter matches that the user has not predicted
    const missingMatches = matches.filter(m => !predictedMatchIds.has(m._id.toString()));
    if (matches.length === 0) {
        yield interaction.editReply({ content: "📂​ No hay partidos activos." });
        return;
    }
    let message = "🎲​ **Partidos activos:**\n";
    message += matches
        .map(match => {
        const { sup } = (0, sup_1.getSupLabels)(match.matchType);
        let item = `- **${(0, timestamp_1.diaSimple)(match.datetime)}, ${(0, timestamp_1.horaSimpleConHrs)(match.datetime)}:** ${match.team1} vs. ${match.team2}${sup} `;
        const isMissing = missingMatches.includes(match.id);
        const statusEmoji = isMissing ? "⏳" : "✅";
        return item + statusEmoji;
    })
        .join("\n");
    yield interaction.editReply({ content: message });
});
const seeMatches_simple = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, replyFn }) {
    const db = yield (0, connections_1.default)();
    const Match = db.model("Match");
    const Prediction = db.model("Prediction", prediction_1.PredictionSchema);
    let matchFilter = { isFinished: false };
    const matches = yield Match.find(matchFilter);
    const predictions = yield Prediction.find({ userId });
    const predictedMatchIds = new Set(predictions.map(p => p.matchId.toString()));
    const missingMatches = matches.filter(m => !predictedMatchIds.has(m._id.toString()));
    if (matches.length === 0) {
        yield replyFn("📂​ No hay partidos activos.");
        return;
    }
    let message = "🎲​ **Partidos activos:**\n";
    message += matches
        .map(match => {
        const { sup } = (0, sup_1.getSupLabels)(match.matchType);
        let item = `- **${(0, timestamp_1.diaSimple)(match.datetime)}, ${(0, timestamp_1.horaSimpleConHrs)(match.datetime)}:** ${match.team1} vs. ${match.team2}${sup} `;
        const isMissing = missingMatches.includes(match.id);
        const statusEmoji = isMissing ? "⏳" : "✅";
        return item + statusEmoji;
    })
        .join("\n");
    yield replyFn(message);
});
exports.default = { seeMatches, seeMatches_simple };
