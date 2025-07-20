import { ChatInputCommandInteraction, Interaction, Message } from "discord.js";
import {
    sayCommand,
    createMatchCommand,
    setGroupStageOnlyCommand,
    createPollaCommand,
    seeAuraCommand,
    seeResultsCommand,
    seeMatches,
    sendScorePredictionCommand    
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
  }
}


const InteractionwithMessage = async (message: Message, params:string) => {
  switch (params){
    case "see_matches":
      await seeMatches.seeMatches_simple({
        userId: message.author.id,
        replyFn: (content: string) => message.reply(content)
      });
      break
    case "see-results":
      console.log("Comando 02")
      break
    case "see-my-aura":
      console.log("Comando 03")
      break
    default:
      console.log("Comand default")
      break
  }
}

export { InteractionwithMessage, interactionCreateEvent };