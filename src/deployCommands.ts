import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import commands from './config/commands';

const DISCORD_TOKEN = process.env.TOKEN_DISCORD as string;
const CLIENT_ID = process.env.CLIENT_ID as string; // ID de tu bot
const GUILD_ID = process.env.GUILD_ID as string;   // ID de tu servidor de pruebas

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();