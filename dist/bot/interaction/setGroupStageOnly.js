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
const user_1 = require("../../schemas/user");
const setGroupStageOnlyCommand = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield interaction.deferReply({ ephemeral: true });
    const onlyGroupStage = (_a = interaction.options.get('solo_grupos')) === null || _a === void 0 ? void 0 : _a.value;
    // Limit June 28, 2025, 11am
    const deadlineLima = new Date(Date.UTC(2025, 5, 28, 16, 0, 0)); // 2025-06-28 00:00:00-05:00 = 2025-06-28 05:00:00 UTC
    const nowUTC = new Date();
    if (nowUTC >= deadlineLima) {
        yield interaction.editReply({
            content: "⏰ Ya no puedes cambiar esta opción. El plazo para elegir terminó."
        });
        return;
    }
    const db = yield (0, connections_1.default)();
    const UserStats = db.model("UserStats", user_1.UserStatsSchema);
    yield UserStats.updateOne({ userId: interaction.user.id }, { $set: { onlyGroupStage } }, { upsert: true });
    yield interaction.editReply({
        content: onlyGroupStage
            ? "🏳️‍🌈​ Has elegido **apostar solo en fase de grupos**. No estarás obligado a apostar en las siguientes fases. ¡¡ARRIBA ALIANZA!!"
            : "😎 Has elegido **apostar en todas las fases**. ¡Recuerda que deberás apostar en todos los partidos luego de la fase de grupos!"
    });
});
exports.default = setGroupStageOnlyCommand;
