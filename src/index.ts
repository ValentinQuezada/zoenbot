import 'dotenv/config'
import { Client, GatewayIntentBits, REST, Routes, Interaction } from 'discord.js'
import commands from './config/commands'
import interactionCreateEvent from './events/interactionCreate';
import {chat} from "./gen/client"
import { Message } from 'discord.js'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD as string)

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

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  if (client.user && message.mentions.has(client.user.id)) {
    const botMention = `<@${client.user.id}>`;
    const cleanMessage = message.content.replace(botMention, '').trim();

    const response = await chat(cleanMessage);
    console.log(response)
    if (response && typeof response === 'object' && 'content' in response) {
      await message.reply(response.content as string);
    }
  }
});

client.login(process.env.TOKEN_DISCORD)