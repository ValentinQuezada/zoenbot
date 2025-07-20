import { CommandInteraction } from "discord.js";
import databaseConnection from "../../database/connections";
import { UserStatsSchema } from "../../schemas/user";
import { ChatInputCommandInteraction } from "discord.js";

const setGroupStageOnlyCommand = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true });
    console.log("Comando setGroupStageOnlyCommand ejecutado");

    const onlyGroupStage = interaction.options.get('solo_grupos')?.value as boolean;
    console.log("Valor de onlyGroupStage:", onlyGroupStage);

    const deadlineLima = new Date(Date.UTC(2025, 5, 28, 16, 0, 0));
    const nowUTC = new Date();

    if (nowUTC >= deadlineLima) {
      console.log("Plazo vencido, no se puede cambiar la opción.");
      await interaction.editReply({
        content: "⏰ Ya no puedes cambiar esta opción. El plazo para elegir terminó."
      });
      return;
    }

    const db = await databaseConnection();
    console.log("Conexión a la base de datos obtenida:", !!db);

    const UserStats = db.model("UserStats", UserStatsSchema);

    const updateResult = await UserStats.updateOne(
      { userId: interaction.user.id },
      { $set: { onlyGroupStage } },
      { upsert: true }
    );
    console.log("Resultado de updateOne:", updateResult);

    await interaction.editReply({
      content: onlyGroupStage
        ? "🏳️‍🌈​ Has elegido **apostar solo en fase de grupos**. No estarás obligado a apostar en las siguientes fases. ¡¡ARRIBA ALIANZA!!"
        : "😎 Has elegido **apostar en todas las fases**. ¡Recuerda que deberás apostar en todos los partidos luego de la fase de grupos!"
    });
};

export default setGroupStageOnlyCommand;