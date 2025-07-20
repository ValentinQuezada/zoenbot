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
        case 'setGroupStageOnly':
            yield (0, interaction_1.setGroupStageOnlyCommand)(commandInteraction);
            break;
    }
});
exports.interactionCreateEvent = interactionCreateEvent;
const InteractionwithMessage = (message, params) => __awaiter(void 0, void 0, void 0, function* () {
    switch (params) {
        case "see_matches":
            yield interaction_1.seeMatches.seeMatches_simple({
                userId: message.author.id,
                replyFn: (content) => message.reply(content)
            });
            break;
        case "see-results":
            yield interaction_1.seeResultsCommand.seeResults_simple({
                userId: message.author.id,
                replyFn: (content) => message.reply(content)
            });
            break;
        case "see-my-aura":
            yield interaction_1.seeAuraCommand.seeAura_simple({
                userId: message.author.id,
                replyFn: (content) => message.reply(content)
            });
            break;
        default:
            console.log("Comand default");
            break;
    }
});
exports.InteractionwithMessage = InteractionwithMessage;
