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
exports.BOT_CLIENT = void 0;
exports.replaceMentionsWithUsernames = replaceMentionsWithUsernames;
exports.botResponse = botResponse;
exports.generalprocessing = generalprocessing;
exports.checkadmin = checkadmin;
const discord_js_1 = require("discord.js");
const client_1 = require("./gen/client");
const _1 = require(".");
exports.BOT_CLIENT = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
function replaceMentionsWithUsernames(msg) {
    return msg.content.replace(/<@!?(\d+)>/g, (match, userId) => {
        const user = exports.BOT_CLIENT.users.cache.get(userId);
        return user ? `@${user.username}` : match;
    });
}
function botResponse(message, cleanedContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const botMention = exports.BOT_CLIENT.user ? `<@${exports.BOT_CLIENT.user.id}>` : '';
        const cleanMessage = botMention ? message.content.replace(botMention, '').trim() : message.content.trim();
        const intention = yield (0, client_1.identify)(cleanMessage);
        const intentionstr = intention.text;
        if (intentionstr == "chat") {
            botChat(message, cleanMessage, cleanedContext);
        }
        return intentionstr;
    });
}
function botChat(message, cleanMessage, cleanedContext) {
    return __awaiter(this, void 0, void 0, function* () {
        if ('sendTyping' in message.channel && typeof message.channel.sendTyping === 'function') {
            yield message.channel.sendTyping();
        }
        const conversation = cleanedContext.map((m) => `${m.author.username}: ${m.content}`).join('\n');
        const summary = yield (0, client_1.summarize)(conversation);
        const summaryText = summary.text;
        const response = yield (0, client_1.chat)(cleanMessage, summaryText);
        yield message.reply(response.text);
    });
}
function generalprocessing(message) {
    const key = message.channel.id;
    if (!_1.contextMap.has(key)) {
        _1.contextMap.set(key, []);
    }
    const context = _1.contextMap.get(key);
    context.push(message);
    if (context.length > 30)
        context.shift();
    const cleanedContext = context.map(m => (Object.assign(Object.assign({}, m), { content: replaceMentionsWithUsernames(m) })));
    return cleanedContext;
}
function checkadmin(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!message.guild)
            return [];
        try {
            const member = yield message.guild.members.fetch(message.author.id);
            if (!member)
                return [];
            const roles = member.roles.cache.map(role => role.name.toLowerCase());
            return roles.find(role => role == "admin");
        }
        catch (error) {
            console.error("Error getting user roles:", error);
            return [];
        }
    });
}
