import 'dotenv/config'
import { Client, GatewayIntentBits, REST, Routes, Interaction, Message } from 'discord.js'
import commands from './config/commands'
import interactionCreateEvent from './events/interactionCreate';
import {chat, summarize} from "./gen/client"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD as string)

export const contextMap = new Map<string, Message[]>();

client.once('ready', async () => {
  if (!client.user) return
  console.log(`Logged in as ${client.user.tag}!`)
  await rest.put(
    Routes.applicationGuildCommands(client.user.id, '1396212612429254767'),
    { body: commands }
  )
  console.log('Slash commands registered!')
})


client.on('interactionCreate', interactionCreateEvent);


client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;

  const key = message.channel.id;

  // GET CHANNEL CONTEXT
  if (!contextMap.has(key)) { contextMap.set(key, []); }
  const context = contextMap.get(key)!;
  context.push(message);
  if (context.length > 15) context.shift();

  // IF TAGGED
  if (client.user && message.mentions.has(client.user.id)) {
    const botMention = `<@${client.user.id}>`;
    const cleanMessage = message.content.replace(botMention, '').trim();
    const summary = await summarize(key);
    const summaryText = summary.text as string;

    const response = await chat(cleanMessage,summaryText);
    console.log(response)
    if (response && typeof response === 'object' && 'content' in response) {
      await message.reply(response.content as string);
    }
  }
});

client.login(process.env.TOKEN_DISCORD)