import { CommandInteraction } from 'discord.js';

const holaCommand = async (interaction: CommandInteraction) => {
  await interaction.reply('¡Hola! 👋');
};

export default holaCommand;