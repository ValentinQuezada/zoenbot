import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

const createPollaCommand = new SlashCommandBuilder()
  .setName('crear-polla')
  .setDescription('Crea una nueva polla para predicciones')
  .addStringOption(option =>
    option.setName('nombre')
      .setDescription('Nombre de la polla')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('equipos')
      .setDescription('Lista de equipos (separados por coma)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('descripcion')
      .setDescription('Descripción (opcional)')
      .setRequired(false)
  );

  export default createPollaCommand;
