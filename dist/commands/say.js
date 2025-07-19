"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const sayCommand = new discord_js_1.SlashCommandBuilder()
    .setName('say')
    .setDescription('Envía un mensaje a través del bot (sólo para el owner)')
    .addStringOption(option => option.setName('message')
    .setDescription('Mensaje a enviar')
    .setRequired(true));
exports.default = sayCommand;
