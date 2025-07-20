"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const sendMatchScorePredictionCommand = new discord_js_1.SlashCommandBuilder()
    .setName('send-score-prediction')
    .setDescription('Envía tu predicción para un partido')
    .addStringOption(option => option.setName('prediction')
    .setDescription('Escribe tu predicción en el formato que desees')
    .setRequired(true));
exports.default = sendMatchScorePredictionCommand;
