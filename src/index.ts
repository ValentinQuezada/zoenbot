import 'dotenv/config'
import { Client, GatewayIntentBits, REST, Routes, Interaction, Message } from 'discord.js'
import commands from './config/commands'
import interactionCreateEvent from './events/interactionCreate';
import {chat} from "./gen/client"

const BOT_CLIENT = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD as string)

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

BOT_CLIENT.login(process.env.TOKEN_DISCORD);

export default BOT_CLIENT;
