import { ChatInputCommandInteraction, Interaction } from "discord.js";
import {
    sayCommand
} from "../interaction";

const interactionCreateEvent = async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
  
  const commandInteraction = interaction as ChatInputCommandInteraction;
  
  switch (commandInteraction.commandName) {
    case 'say':
      await sayCommand(commandInteraction);
      break;
  }
}

export default interactionCreateEvent;