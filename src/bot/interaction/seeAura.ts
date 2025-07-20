import mongoose from "mongoose";
import { AuraPointsSchema } from "../../schemas/aura";
import databaseConnection from "../../database/connections";
import { AURA_POINTS_VALUES, ATTRIBUTES } from "../../config/auraPointsValues";

const seeAuraCommand = {
  async execute(interaction: any) {
    await databaseConnection();
    const AuraPoints = mongoose.model("AuraPoints", AuraPointsSchema);

    // sorts the leaderboard by totalPoints in descending order
    const leaderboard = await AuraPoints.find({}).sort({ totalPoints: -1 }).lean();
    // let lastRank = leaderboard.findIndex(row => row.userId === interaction.user.id) as number;
    // lastRank += 1;
    let lastPoints = null;
    let lastRank = 0;
    for (let idx = 0; idx < leaderboard.length; idx++) {
      const row = leaderboard[idx];
      if (lastPoints != row.totalPoints) {
        lastRank = idx + 1;
        lastPoints = row.totalPoints;
      }
      if( row.userId === interaction.user.id ) break;
    }
    const userAura = leaderboard.find(row => row.userId === interaction.user.id) as any;
    if (userAura) {
      let privateMessage = `🔎 **Tus Aura Points (💠) por atributo:**\n`;
      ATTRIBUTES.forEach(attr => {
        if (attr.key !== "totalPoints") {
          privateMessage += `${attr.label} **${attr.name}:** ${userAura[attr.key] ?? 0} 💠`;
        }
        if (attr.key == "matchesHit" || attr.key == "uniqueHit" || attr.key == "specialHit" || attr.key == "lateGoalHit" || attr.key == "upsetHit") {
          privateMessage += ` (${AURA_POINTS_VALUES[attr.key as keyof typeof AURA_POINTS_VALUES]} por hit)`
        } else if (attr.key == "streak3plus") {
          privateMessage += ` (${AURA_POINTS_VALUES[attr.key as keyof typeof AURA_POINTS_VALUES]} por racha acumulada)`
        } else if (attr.key == "awardHit") {
          privateMessage += ` (${AURA_POINTS_VALUES[attr.key as keyof typeof AURA_POINTS_VALUES]} por award)`
        } else if (attr.key == "recordHit") {
          privateMessage += ` (${AURA_POINTS_VALUES[attr.key as keyof typeof AURA_POINTS_VALUES]} por récord)`
        }
        privateMessage += `\n`
      });
      privateMessage += `💠 **TOTALES: ${userAura.totalPoints}** Aura Points\n`;
      privateMessage += `📊​ Ranking: ${lastRank}/${leaderboard.length}`;
      await interaction.reply({ content: privateMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: "📂​ No hay datos de **Aura Points** aún." });
      return;
    }
  }
};

export default seeAuraCommand;