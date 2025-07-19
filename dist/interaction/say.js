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
Object.defineProperty(exports, "__esModule", { value: true });
const credentials_1 = require("../config/credentials");
const sayCommand = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!interaction.guild) {
        yield interaction.reply({
            content: '⛔ Este comando solo puede usarse en un servidor.',
            ephemeral: true
        });
        return;
    }
    // validate if the user is the owner or has the required role
    const member = interaction.member;
    const hasRole = member.roles.cache.some(role => role.name === credentials_1.REQUIRED_ROLE);
    if (!hasRole) {
        yield interaction.reply({
            content: '⛔ No tienes permiso para usar este comando.',
            ephemeral: true
        });
        return;
    }
    const message = (_a = interaction.options.get('message')) === null || _a === void 0 ? void 0 : _a.value;
    if (interaction.channel &&
        'send' in interaction.channel &&
        typeof interaction.channel.send === 'function') {
        yield interaction.channel.send(message);
    }
    yield interaction.reply({
        content: `✅ ¡Mensaje enviado con éxito!`,
        ephemeral: true
    });
});
exports.default = sayCommand;
