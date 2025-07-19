import { Client, GatewayIntentBits, Message} from 'discord.js'

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