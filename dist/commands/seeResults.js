"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const seeResultsCommand = new discord_js_1.SlashCommandBuilder()
    .setName('see-results')
    .setDescription('Muestra tus predicciones de partidos que aún no han finalizado');
exports.default = seeResultsCommand;
