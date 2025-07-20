"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const seeMatchesCommand = new discord_js_1.SlashCommandBuilder()
    .setName('see-matches')
    .setDescription('Muestra los partidos activos');
exports.default = seeMatchesCommand;
