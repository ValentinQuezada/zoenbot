import 'dotenv/config'
import { Client, GatewayIntentBits, REST, Routes, Interaction, Message } from 'discord.js'
import commands from './config/commands'
import interactionCreateEvent from './events/interactionCreate';
import {chat, summarize} from "./gen/client"

const BOT_CLIENT = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD as string)

export const contextMap = new Map<string, Message[]>();

BOT_CLIENT.once('ready', async () => {
  if (!BOT_CLIENT.user) return
  console.log(`Logged in as ${BOT_CLIENT.user.tag}!`)
  await rest.put(
    Routes.applicationGuildCommands(BOT_CLIENT.user.id, '1396212612429254767'),
    { body: commands }
  )
  console.log('Slash commands registered!')
})

BOT_CLIENT.on('interactionCreate', interactionCreateEvent);

BOT_CLIENT.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;

  const key = message.channel.id;

  // GET CHANNEL CONTEXT
  if (!contextMap.has(key)) { contextMap.set(key, []); }
  const context = contextMap.get(key)!;
  context.push(message);
  if (context.length > 15) context.shift();

  // IF TAGGED
  if (BOT_CLIENT.user && message.mentions.has(BOT_CLIENT.user.id)) {
    const botMention = `<@${BOT_CLIENT.user.id}>`;
    const cleanMessage = message.content.replace(botMention, '').trim();
    const conversation = context.map(m => `${m.author.username}: ${m.content}`).join('\n');
    
    console.log(conversation)

    const summary = await summarize(conversation);
    const summaryText = summary.text as string;

    console.log(summaryText)

    const response = await chat(cleanMessage,summaryText);
    console.log(response)
    if (response && typeof response === 'object' && 'content' in response) {
      await message.reply(response.text as string);
    }
  }
});

BOT_CLIENT.login(process.env.TOKEN_DISCORD);

export default BOT_CLIENT;