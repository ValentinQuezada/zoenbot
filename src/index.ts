import 'dotenv/config'
import { Client, GatewayIntentBits, REST, Routes, Interaction, Message } from 'discord.js'
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

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === 'hola') {
    await holaCommand(interaction)
  }

  if (interaction.commandName === 'checkstock') {
    await checkstockCommand(interaction)
  }
})



client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;

  // GET CHANNEL CONTEXT
  const key = message.channel.id;
  if (!contextMap.has(key)) { contextMap.set(key, []); }
  
  const context = contextMap.get(key)!;
  context.push(message);
  if (context.length > 15) context.shift();

  // IF TAGGED
  if (client.user && message.mentions.has(client.user.id)) {
    await message.reply(`¡Me has taggeado!: ${message}`);
  }
});





client.login(process.env.TOKEN_DISCORD)