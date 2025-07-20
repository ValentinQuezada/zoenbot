import { ChatInputCommandInteraction } from "discord.js";
import databaseConnection from "../../database/connections";
import { PredictionSchema } from "../../schemas/prediction";
import { horaSimpleConHrs } from "../../utils/timestamp";
import { getSupLabels } from "../../utils/sup";

const seeResultsCommand = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true });

    const db = await databaseConnection();
    const Prediction = db.model("Prediction", PredictionSchema);
    const Match = db.model("Match");

    // search for all predictions of the user
    const predictions = await Prediction.find({ userId: interaction.user.id });
    const matchIds = predictions.map(p => p.matchId);
    const matches = await Match.find({ _id: { $in: matchIds }, isFinished: false });

    if (matches.length === 0) {
      await interaction.editReply({ content: "​📂​​ No tienes predicciones pendientes." });
      return;
    }

    let message = "🎲 **Tus predicciones activas:**\n";
    for (const match of matches) {
      const { sup } = getSupLabels(match.matchType);
      const pred = predictions.find(p => p.matchId.toString() === match._id.toString());
      let key: string;
      if(pred?.prediction.team1 != pred?.prediction.team2){
        key = "";
      } else {
        switch (pred?.prediction.advances) {
          case 'team1':
            key = match.team1;
            break;
          case 'team2':
            key = match.team2;
            break;
          default:
            key = "";
        }
      }
      message += `- **${match.team1} vs. ${match.team2}${sup}** (${horaSimpleConHrs(match.datetime)}): ${pred?.prediction.team1}-${pred?.prediction.team2}. ${pred?.prediction.advances ? `El equipo que avanza es: **${key}**.` : ''}\n`;
    }

    await interaction.editReply({ content: message });
};


type SeeResultsParams = {
  userId: string;
  replyFn: (msg: string) => Promise<any>;
};

const seeResults_simple = async ({ userId, replyFn }: SeeResultsParams) => {
  const db = await databaseConnection();
  const Prediction = db.model("Prediction", PredictionSchema);
  const Match = db.model("Match");

  // search for all predictions of the user
  const predictions = await Prediction.find({ userId });
  const matchIds = predictions.map(p => p.matchId);
  const matches = await Match.find({ _id: { $in: matchIds }, isFinished: false });

  if (matches.length === 0) {
    await replyFn("​📂​​ No tienes predicciones pendientes.");
    return;
  }

  let message = "🎲 **Tus predicciones activas:**\n";
  for (const match of matches) {
    const { sup } = getSupLabels(match.matchType);
    const pred = predictions.find(p => p.matchId.toString() === match._id.toString());
    let key: string;
    if(pred?.prediction.team1 != pred?.prediction.team2){
      key = "";
    } else {
      switch (pred?.prediction.advances) {
        case 'team1':
          key = match.team1;
          break;
        case 'team2':
          key = match.team2;
          break;
        default:
          key = "";
      }
    }
    message += `- **${match.team1} vs. ${match.team2}${sup}** (${horaSimpleConHrs(match.datetime)}): ${pred?.prediction.team1}-${pred?.prediction.team2}. ${pred?.prediction.advances ? `El equipo que avanza es: **${key}**.` : ''}\n`;
  }

  await replyFn(message);
};

export default {seeResultsCommand, seeResults_simple};