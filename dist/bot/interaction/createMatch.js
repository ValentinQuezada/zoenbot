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
const controllers_1 = require("../../database/controllers");
const checkRole_1 = require("../../utils/checkRole");
const index_1 = __importDefault(require("../../index"));
const credentials_1 = require("../../config/credentials");
const client_1 = require("../../gen/client");
const createMatchCommand = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const hasRole = yield (0, checkRole_1.checkRole)(interaction, "ADMIN");
    if (!hasRole) {
        yield interaction.reply({
            content: `⛔ No tienes permiso para usar este comando.`,
            ephemeral: true
        });
        return;
    }
    yield interaction.deferReply({ ephemeral: true });
    let team1 = (_a = interaction.options.get('team1')) === null || _a === void 0 ? void 0 : _a.value;
    let team2 = (_b = interaction.options.get('team2')) === null || _b === void 0 ? void 0 : _b.value;
    const response1 = yield (0, client_1.mapTeamName)(team1);
    if (!response1.success) {
        yield interaction.editReply({ content: "❌ Equipo no encontrado." });
        return;
    }
    console.log(response1.data);
    const response2 = yield (0, client_1.mapTeamName)(team2);
    if (!response2.success) {
        yield interaction.editReply({ content: "❌ Equipo no encontrado." });
        return;
    }
    console.log(response2.data);
    const datetime = (_c = interaction.options.get('datetime')) === null || _c === void 0 ? void 0 : _c.value;
    const group = (_d = interaction.options.get('group')) === null || _d === void 0 ? void 0 : _d.value;
    const matchType = (_e = interaction.options.get('matchtype')) === null || _e === void 0 ? void 0 : _e.value;
    const fee = (_g = (_f = interaction.options.get('fee')) === null || _f === void 0 ? void 0 : _f.value) !== null && _g !== void 0 ? _g : 5;
    function limaToUTC(dateString) {
        const [date, time] = dateString.split(" ");
        const [year, month, day] = date.split("-").map(Number);
        const [hour, minute] = time.split(":").map(Number);
        return new Date(Date.UTC(year, month - 1, day, hour + 5, minute));
    }
    yield (0, controllers_1.createMatch)({
        team1,
        team2,
        datetime: limaToUTC(datetime),
        group,
        matchType,
        isFinished: false,
        hasStarted: false,
        specialHit: false,
        lateGoalHit: false,
        upsetHit: false,
        fee,
        statsAnnounced: false
    });
    const announceMsg = `📢 ***¡Nuevo partido creado!**\n**${team1} vs. ${team2}**\n🕒 Empieza el ${datetime} (hora Perú)\nEnvía tu predicción con* \`/send-score-prediction\``;
    // send announcement to the general channel
    try {
        const channel = yield index_1.default.channels.fetch(credentials_1.GENERAL_CHANNEL_ID);
        if (channel && 'send' in channel) {
            yield channel.send(announceMsg);
        }
    }
    catch (e) {
        console.error("Error al enviar el mensaje al canal general:", e);
        yield interaction.editReply({
            content: "❌ No se pudo enviar el mensaje de anuncio al canal general."
        });
        return;
    }
    yield interaction.editReply({
        content: `✅​ ¡Partido **${team1} vs. ${team2}** creado con éxito!`
    });
});
exports.default = createMatchCommand;
