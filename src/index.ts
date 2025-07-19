import 'dotenv/config'
import { Client, GatewayIntentBits, REST, Routes, Interaction } from 'discord.js'
import commands from './config/commands'
import holaCommand from './commands/hola'
import checkstockCommand from './commands/checkstock'

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

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === 'hola') {
    await holaCommand(interaction)
  }

  if (interaction.commandName === 'checkstock') {
    await checkstockCommand(interaction)
  }
})

client.login(process.env.TOKEN_DISCORD)