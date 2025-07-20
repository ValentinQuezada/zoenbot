import 'dotenv/config'
import { REST, Routes, Message } from 'discord.js'
import commands from './config/commands'
import interactionCreateEvent from './bot/events/interactionCreate';
import { BOT_CLIENT, botResponse, generalprocessing} from './generals';
import { checkRole } from './utils/checkRole';
import { checkadmin } from './generals';

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

  const cleanedContext = generalprocessing(message)

  botResponse(message,cleanedContext);  
});

BOT_CLIENT.login(process.env.TOKEN_DISCORD);

export default BOT_CLIENT;