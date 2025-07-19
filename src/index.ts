import 'dotenv/config'
import { Client, GatewayIntentBits, REST, Routes, Message } from 'discord.js'
import commands from './config/commands'
import interactionCreateEvent from './events/interactionCreate';
import {chat, summarize} from "./gen/client"
import { BOT_CLIENT } from './generals';
import { replaceMentionsWithUsernames } from './generals';

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

  if (!contextMap.has(key)) { contextMap.set(key, []); }
  const context = contextMap.get(key)!;
  context.push(message);
  if (context.length > 30) context.shift();

  const cleanedContext = context.map(m => ({
    ...m,
    content: replaceMentionsWithUsernames(m)
  }));

  if (BOT_CLIENT.user && message.mentions.has(BOT_CLIENT.user.id)) {
    const botMention = `<@${BOT_CLIENT.user.id}>`;
    const cleanMessage = message.content.replace(botMention, '').trim();

    if ('sendTyping' in message.channel && typeof message.channel.sendTyping === 'function') {
      await message.channel.sendTyping();
    }

    const conversation = cleanedContext.map(m => `${m.author.username}: ${m.content}`).join('\n');
  
    const summary = await summarize(conversation);
    const summaryText = summary.text as string;
    const response = await chat(cleanMessage, summaryText);

    await message.reply(response.text as string);
  }
});

BOT_CLIENT.login(process.env.TOKEN_DISCORD);

export default BOT_CLIENT;