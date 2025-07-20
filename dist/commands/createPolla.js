"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const createPollaCommand = new discord_js_1.SlashCommandBuilder()
    .setName('crear-polla')
    .setDescription('Crea una nueva polla para predicciones')
    .addStringOption(option => option.setName('nombre')
    .setDescription('Nombre de la polla')
    .setRequired(true))
    .addStringOption(option => option.setName('equipos')
    .setDescription('Lista de equipos (separados por coma)')
    .setRequired(true))
    .addStringOption(option => option.setName('descripcion')
    .setDescription('Descripción (opcional)')
    .setRequired(false));
exports.default = createPollaCommand;
