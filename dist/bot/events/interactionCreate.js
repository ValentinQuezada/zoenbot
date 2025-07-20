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
exports.interactionCreateEvent = exports.InteractionwithMessage = void 0;
const interaction_1 = require("../interaction");
const interactionCreateEvent = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    const commandInteraction = interaction;
    switch (commandInteraction.commandName) {
        case 'say':
            yield (0, interaction_1.sayCommand)(commandInteraction);
            break;
        case 'createMatch':
            yield (0, interaction_1.createMatchCommand)(commandInteraction);
            break;
    }
});
exports.interactionCreateEvent = interactionCreateEvent;
const InteractionwithMessage = (params) => __awaiter(void 0, void 0, void 0, function* () {
    switch (params) {
        case "see_matches":
            console.log("Comando 01");
        case "see-results":
            console.log("Comando 02");
        case "see-my-aura":
            console.log("Comando 03");
        default:
            console.log("Comand default");
    }
});
exports.InteractionwithMessage = InteractionwithMessage;
