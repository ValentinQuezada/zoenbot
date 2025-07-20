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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextMap = void 0;
require("dotenv/config");
const discord_js_1 = require("discord.js");
const commands_1 = __importDefault(require("./config/commands"));
const interactionCreate_1 = require("./bot/events/interactionCreate");
const generals_1 = require("./generals");
const generals_2 = require("./generals");
const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD);
exports.contextMap = new Map();
generals_1.BOT_CLIENT.once('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!generals_1.BOT_CLIENT.user)
        return;
    console.log(`Logged in as ${generals_1.BOT_CLIENT.user.tag}!`);
    yield rest.put(discord_js_1.Routes.applicationGuildCommands(generals_1.BOT_CLIENT.user.id, '1396212612429254767'), { body: commands_1.default });
    console.log('Slash commands registered!');
}));
generals_1.BOT_CLIENT.on('interactionCreate', interactionCreate_1.interactionCreateEvent);
generals_1.BOT_CLIENT.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    const cleanedContext = (0, generals_1.generalprocessing)(message);
    if (generals_1.BOT_CLIENT.user && message.mentions.has(generals_1.BOT_CLIENT.user.id)) {
        const admin = yield (0, generals_2.checkadmin)(message);
        if (admin) {
            (0, generals_1.botresponds)(message, cleanedContext);
        }
        else {
            yield message.reply("No eres admin provinciano");
        }
    }
}));
generals_1.BOT_CLIENT.login(process.env.TOKEN_DISCORD);
exports.default = generals_1.BOT_CLIENT;
