require('dotenv').config()
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

// Register slash commands
const commands = [
  {
    name: 'hola',
    description: 'Saluda al bot'
  },
  {
    name: 'checkstock',
    description: 'Verifica el stock del producto'
  }
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD)

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)
  await rest.put(
    Routes.applicationGuildCommands(client.user.id, '1396212612429254767'),
    { body: commands }
  )
  console.log('Slash commands registered!')
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === 'hola') {
    await interaction.reply('¡Hola! 👋')
  }

  if (interaction.commandName === 'checkstock') {
    await interaction.reply('Stock check completed!')
  }
})

client.login(process.env.TOKEN_DISCORD)

//