import { ChatInputCommandInteraction, Interaction, Message } from "discord.js";
import {
    sayCommand,
    createMatchCommand,
    setGroupStageOnlyCommand,
    
} from "../interaction";

import seeMatches from "../interaction/seeMatches"
import seeResults from "../interaction/seeResults";
import seeAura from "../interaction/seeAura"

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
      await seeResults.seeResults_simple({
        userId: message.author.id,
        replyFn: (content: string) => message.reply(content)
      });
      break
    case "see-my-aura":
      await seeAura.seeAura_simple({
        userId: message.author.id,
        replyFn: (content: string) => message.reply(content)
      });
      break
    default:
      console.log("Comand default")
      break
  }
}

export { InteractionwithMessage, interactionCreateEvent };