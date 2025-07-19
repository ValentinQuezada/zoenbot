import { Client, GatewayIntentBits, Message} from 'discord.js'
import {chat, summarize} from "./gen/client"
import { contextMap } from '.';

export const BOT_CLIENT = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

export function replaceMentionsWithUsernames(msg: Message) {
  return msg.content.replace(/<@!?(\d+)>/g, (match, userId) => {
    const user = BOT_CLIENT.users.cache.get(userId);
    return user ? `@${user.username}` : match;
  });
}

export async function botresponds(message: Message, cleanedContext: any) {
    const botMention = BOT_CLIENT.user ? `<@${BOT_CLIENT.user.id}>` : '';
    const cleanMessage = botMention ? message.content.replace(botMention, '').trim() : message.content.trim();
    if ('sendTyping' in message.channel && typeof message.channel.sendTyping === 'function') {
      await message.channel.sendTyping();
    }

    const conversation = cleanedContext.map((m: Message) => `${m.author.username}: ${m.content}`).join('\n');
    const summary = await summarize(conversation);
    const summaryText = summary.text as string;
    console.log(summaryText)

    const response = await chat(cleanMessage, summaryText);
    await message.reply(response.text as string);
}

export function generalprocessing (message: Message){
    const key = message.channel.id;

  if (!contextMap.has(key)) { contextMap.set(key, []); }
  const context = contextMap.get(key)!;
  context.push(message);
  if (context.length > 30) context.shift();

  const cleanedContext = context.map(m => ({
    ...m,
    content: replaceMentionsWithUsernames(m)
  }));

  return cleanedContext
}