import { CommandInteraction } from "discord.js";
import databaseConnection from "../../database/connections";
import { PredictionSchema } from "../../schemas/prediction";
import { horaSimpleConHrs, diaSimple } from "../../utils/timestamp";
import { getSupLabels } from "../../utils/sup";

const seeMatches = async (interaction: CommandInteraction) => {
  await interaction.deferReply({ ephemeral: true });

  const db = await databaseConnection();
  const Match = db.model("Match");
  const Prediction = db.model("Prediction", PredictionSchema);

  // search for all matches that are not finished
  let matchFilter: any = { isFinished: false };
  const matches = await Match.find(matchFilter);

    // search for all predictions of the user
    const predictions = await Prediction.find({ userId: interaction.user.id });
    const predictedMatchIds = new Set(predictions.map(p => p.matchId.toString()));

    // filter matches that the user has not predicted
    const missingMatches = matches.filter(m => !predictedMatchIds.has(m._id.toString()));

  if (matches.length === 0) {
    await interaction.editReply({ content: "📂​ No hay partidos activos." });
    return;
  }

  let message = "🎲​ **Partidos activos:**\n";
  message += matches
    .map(match => {
      const { sup } = getSupLabels(match.matchType);
      let item = `- **${diaSimple(match.datetime)}, ${horaSimpleConHrs(match.datetime)}:** ${match.team1} vs. ${match.team2}${sup} `;
      const isMissing = missingMatches.includes(match.id);
      const statusEmoji = isMissing ? "⏳" : "✅";
      return item + statusEmoji;
    })
    .join("\n");

  await interaction.editReply({ content: message });
}

export default seeMatches;
