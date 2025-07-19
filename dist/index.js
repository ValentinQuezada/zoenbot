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
require("dotenv/config");
const discord_js_1 = require("discord.js");
const commands_1 = __importDefault(require("./config/commands"));
const hola_1 = __importDefault(require("./commands/hola"));
const checkstock_1 = __importDefault(require("./commands/checkstock"));
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD);
client.once('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!client.user)
        return;
    console.log(`Logged in as ${client.user.tag}!`);
    yield rest.put(discord_js_1.Routes.applicationGuildCommands(client.user.id, '1396212612429254767'), { body: commands_1.default });
    console.log('Slash commands registered!');
}));
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    if (interaction.commandName === 'hola') {
        yield (0, hola_1.default)(interaction);
    }
    if (interaction.commandName === 'checkstock') {
        yield (0, checkstock_1.default)(interaction);
    }
}));
client.login(process.env.TOKEN_DISCORD);
