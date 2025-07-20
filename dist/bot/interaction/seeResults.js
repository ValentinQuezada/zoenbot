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
const seeResultsCommand = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    yield interaction.deferReply({ ephemeral: true });
    const db = yield (0, connections_1.default)();
    const Prediction = db.model("Prediction", prediction_1.PredictionSchema);
    const Match = db.model("Match");
    // search for all predictions of the user
    const predictions = yield Prediction.find({ userId: interaction.user.id });
    const matchIds = predictions.map(p => p.matchId);
    const matches = yield Match.find({ _id: { $in: matchIds }, isFinished: false });
    if (matches.length === 0) {
        yield interaction.editReply({ content: "​📂​​ No tienes predicciones pendientes." });
        return;
    }
    let message = "🎲 **Tus predicciones activas:**\n";
    for (const match of matches) {
        const { sup } = (0, sup_1.getSupLabels)(match.matchType);
        const pred = predictions.find(p => p.matchId.toString() === match._id.toString());
        let key;
        if ((pred === null || pred === void 0 ? void 0 : pred.prediction.team1) != (pred === null || pred === void 0 ? void 0 : pred.prediction.team2)) {
            key = "";
        }
        else {
            switch (pred === null || pred === void 0 ? void 0 : pred.prediction.advances) {
                case 'team1':
                    key = match.team1;
                    break;
                case 'team2':
                    key = match.team2;
                    break;
                default:
                    key = "";
            }
        }
        message += `- **${match.team1} vs. ${match.team2}${sup}** (${(0, timestamp_1.horaSimpleConHrs)(match.datetime)}): ${pred === null || pred === void 0 ? void 0 : pred.prediction.team1}-${pred === null || pred === void 0 ? void 0 : pred.prediction.team2}. ${(pred === null || pred === void 0 ? void 0 : pred.prediction.advances) ? `El equipo que avanza es: **${key}**.` : ''}\n`;
    }
    yield interaction.editReply({ content: message });
});
const seeResults_simple = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, replyFn }) {
    const db = yield (0, connections_1.default)();
    const Prediction = db.model("Prediction", prediction_1.PredictionSchema);
    const Match = db.model("Match");
    // search for all predictions of the user
    const predictions = yield Prediction.find({ userId });
    const matchIds = predictions.map(p => p.matchId);
    const matches = yield Match.find({ _id: { $in: matchIds }, isFinished: false });
    if (matches.length === 0) {
        yield replyFn("​📂​​ No tienes predicciones pendientes.");
        return;
    }
    let message = "🎲 **Tus predicciones activas:**\n";
    for (const match of matches) {
        const { sup } = (0, sup_1.getSupLabels)(match.matchType);
        const pred = predictions.find(p => p.matchId.toString() === match._id.toString());
        let key;
        if ((pred === null || pred === void 0 ? void 0 : pred.prediction.team1) != (pred === null || pred === void 0 ? void 0 : pred.prediction.team2)) {
            key = "";
        }
        else {
            switch (pred === null || pred === void 0 ? void 0 : pred.prediction.advances) {
                case 'team1':
                    key = match.team1;
                    break;
                case 'team2':
                    key = match.team2;
                    break;
                default:
                    key = "";
            }
        }
        message += `- **${match.team1} vs. ${match.team2}${sup}** (${(0, timestamp_1.horaSimpleConHrs)(match.datetime)}): ${pred === null || pred === void 0 ? void 0 : pred.prediction.team1}-${pred === null || pred === void 0 ? void 0 : pred.prediction.team2}. ${(pred === null || pred === void 0 ? void 0 : pred.prediction.advances) ? `El equipo que avanza es: **${key}**.` : ''}\n`;
    }
    yield replyFn(message);
});
exports.default = { seeResultsCommand, seeResults_simple };
