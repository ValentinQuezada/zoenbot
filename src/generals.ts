import { Client, GatewayIntentBits, Message} from 'discord.js'
import {chat, identify, summarize} from "./gen/client"
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

export async function botResponse(message: Message, cleanedContext: any) {
    const botMention = BOT_CLIENT.user ? `<@${BOT_CLIENT.user.id}>` : '';
    const cleanMessage = botMention ? message.content.replace(botMention, '').trim() : message.content.trim();
    const intention = await identify(cleanMessage);
    const intentionstr = intention.text as string;
    
    if (intentionstr == "chat") {
      botChat(message, cleanMessage, cleanedContext);
    }    
    return intentionstr
}

async function botChat(message: Message, cleanMessage: string, cleanedContext: any) {
    const isMention = BOT_CLIENT.user && message.mentions.has(BOT_CLIENT.user.id);

    if (!isMention) return;

    if ('sendTyping' in message.channel && typeof message.channel.sendTyping === 'function') {
      await message.channel.sendTyping();
    }
    
    const conversation = cleanedContext.map((m: Message) => `${m.author.username}: ${m.content}`).join('\n');
    const summary = await summarize(conversation);
    const summaryText = summary.text as string;

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

export async function checkadmin(message: Message) {
  if (!message.guild) return [];

  try {
    const member = await message.guild.members.fetch(message.author.id);
    if (!member) return [];
    const roles = member.roles.cache.map(role => role.name.toLowerCase());

    return roles.find(role => role == "admin")

  } catch (error) {
    console.error("Error getting user roles:", error);
    return [];
  }
}