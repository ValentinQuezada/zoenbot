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
const client_1 = require("../../gen/client");
const controllers_1 = require("../../database/controllers");
const connections_1 = __importDefault(require("../../database/connections"));
const prediction_1 = require("../../schemas/prediction");
const sup_1 = require("../../utils/sup");
const dictionary_1 = require("../../config/dictionary");
const sendScorePredictionCommand = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield interaction.deferReply({ ephemeral: true });
    interaction.editReply({ content: "🔄​ Procesando predicción...", });
    try {
        const predictionText = (_a = interaction.options.get('prediction')) === null || _a === void 0 ? void 0 : _a.value;
        const matches = yield (0, controllers_1.retrieveMatches)();
        let response = yield (0, client_1.linkMatchScore)(predictionText, matches.map(match => [match.team1, match.team2]));
        console.log('Matches retrieved:', matches);
        if (response.success === false) {
            yield interaction.editReply({ content: response.error });
            return;
        }
        console.log(response.data);
        const match = matches.find(m => { var _a, _b; return m.team1 === ((_a = response.data) === null || _a === void 0 ? void 0 : _a.team1) && m.team2 === ((_b = response.data) === null || _b === void 0 ? void 0 : _b.team2); });
        if (!match) {
            yield interaction.editReply({ content: "❌ No se encontró el partido para la predicción." });
            return;
        }
        console.log(match.datetime, new Date());
        if ((0, sup_1.isExtraTime)(match.matchType)) {
            response = yield (0, client_1.linkExtraTimeMatchScore)(predictionText, [match.team1, match.team2]);
            if (response.success === false) {
                yield interaction.editReply({ content: response.error });
                return;
            }
        }
        if (new Date() >= match.datetime) {
            yield interaction.editReply({ content: "⏰​ Ya no puedes apostar, ¡el partido ya empezó!" });
            return;
        }
        const { sup } = (0, sup_1.getSupLabels)(match.matchType);
        if ((0, sup_1.isExtraTime)(match.matchType)
            && response.data.score.team1 === response.data.score.team2 && response.data.advances === undefined) {
            const allowedToBet = match.allowedToBet;
            if (Array.isArray(allowedToBet) && !allowedToBet.includes(interaction.user.id)) {
                yield interaction.editReply({
                    content: "⛔ No puedes apostar en este partido de tiempo extra."
                });
                return;
            }
            return;
        }
        const db = yield (0, connections_1.default)();
        const Prediction = db.model("Prediction", prediction_1.PredictionSchema);
        let existingPrediction = yield Prediction.findOne({
            userId: interaction.user.id,
            matchId: match._id
        });
        let actionMessage;
        if (existingPrediction) {
            existingPrediction.prediction = Object.assign(Object.assign({}, response.data.score), { advances: response.data.advances });
            yield existingPrediction.save();
            actionMessage = dictionary_1.CALLABLES.updateScorePrediction(interaction.user.id, match.team1, match.team2, sup);
        }
        else {
            yield Prediction.create({
                userId: interaction.user.id,
                matchId: match._id,
                prediction: Object.assign(Object.assign({}, response.data.score), { advances: response.data.advances })
            });
            actionMessage = dictionary_1.CALLABLES.sendScorePrediction(interaction.user.id, match.team1, match.team2, sup);
        }
        if (interaction.channel &&
            'send' in interaction.channel &&
            typeof interaction.channel.send === 'function') {
            yield interaction.channel.send(actionMessage);
        }
        yield interaction.editReply({ content: `✅ ¡Se guardó tu predicción para el partido **${match.team1} vs. ${match.team2}${sup}**! Elegiste: **${response.data.score.team1}-${response.data.score.team2}**. ${response.data.advances ? `El equipo que avanza es: **${response.data[response.data.advances]}**.` : ''}` });
    }
    catch (error) {
        console.error('Error in send-score-prediction:', error);
        if (interaction.deferred || interaction.replied) {
            yield interaction.editReply({ content: '❌ Ocurrió un error al procesar tu predicción.' });
        }
        else {
            yield interaction.reply({ content: '❌ Ocurrió un error al procesar tu predicción.', ephemeral: true });
        }
    }
});
exports.default = sendScorePredictionCommand;
