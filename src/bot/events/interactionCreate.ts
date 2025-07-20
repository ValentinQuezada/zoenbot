import { ChatInputCommandInteraction, Interaction } from "discord.js";
import {
    sayCommand,
    createMatchCommand,
    setGroupStageOnlyCommand,
    seeMatchesCommand
    
} from "../interaction";

const interactionCreateEvent = async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
  
  const commandInteraction = interaction as ChatInputCommandInteraction;
  
  switch (commandInteraction.commandName) {
    case 'say':
      await sayCommand(commandInteraction);
      break;
    case 'createMatch':
      await createMatchCommand(commandInteraction);
      break;
    case 'setGroupStageOnly':
      await setGroupStageOnlyCommand(commandInteraction);
      break;
    case 'see-matches':
      await seeMatchesCommand(commandInteraction);
      break;
  }
}


const InteractionwithMessage = async (params:string) => {
  switch (params){
    case "see_matches":
      console.log("Comando 01")
    case "see-results":
      console.log("Comando 02")
    case "see-my-aura":
      console.log("Comando 03")
    default:
      console.log("Comand default")
  }
}

export { InteractionwithMessage, interactionCreateEvent };