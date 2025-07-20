"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const seeAuraCommand = new discord_js_1.SlashCommandBuilder()
    .setName('see-my-aura')
    .setDescription('Muestra tus Aura Points por atributo');
exports.default = seeAuraCommand;
