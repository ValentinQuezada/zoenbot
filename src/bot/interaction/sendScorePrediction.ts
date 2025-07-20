import { ChatInputCommandInteraction } from "discord.js";
import { linkMatchScore, linkExtraTimeMatchScore } from "../../gen/client";
import { retrieveMatches } from "../../database/controllers";
import databaseConnection from "../../database/connections";
import { PredictionSchema } from "../../schemas/prediction";
import { UserStatsSchema } from "../../schemas/user";
import { getSupLabels, isExtraTime } from "../../utils/sup";
import { CALLABLES } from "../../config/dictionary";

const sendScorePredictionCommand = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true });
    interaction.editReply({ content: "🔄​ Procesando predicción...",  });

    try {
        const predictionText = interaction.options.get('prediction')?.value as string;
        const matches = await retrieveMatches();

        let response = await linkMatchScore(predictionText, matches.map(match => [match.team1, match.team2]));
        console.log('Matches retrieved:', matches);
        
        if (response.success === false ) {
            await interaction.editReply({ content: response.error });
            return;
        }
        console.log(response.data);

        const match = matches.find(
            m => m.team1 === response.data?.team1 && m.team2 === response.data?.team2
        );
        if (!match) {
            await interaction.editReply({ content: "❌ No se encontró el partido para la predicción." });
            return;
        }
        console.log(match.datetime, new Date());
        
        if (isExtraTime(match.matchType)) {
            response = await linkExtraTimeMatchScore(predictionText, [match.team1, match.team2]);
            if (response.success === false) {
                await interaction.editReply({ content: response.error });
                return;
            }
        }

        if (new Date() >= match.datetime) {
            await interaction.editReply({ content: "⏰​ Ya no puedes apostar, ¡el partido ya empezó!" });
            return;
        }

        const { sup } = getSupLabels(match.matchType);

        if (isExtraTime(match.matchType)
            && response.data.score.team1 === response.data.score.team2 && response.data.advances === undefined) {

                const allowedToBet = (match as any).allowedToBet;
            if (Array.isArray(allowedToBet) && !allowedToBet.includes(interaction.user.id)) {
                await interaction.editReply({
                    content: "⛔ No puedes apostar en este partido de tiempo extra."
                });
                return;
            }
            return;
        }

        const db = await databaseConnection();
        const Prediction = db.model("Prediction", PredictionSchema);

        let existingPrediction = await Prediction.findOne({
            userId: interaction.user.id,
            matchId: match._id
        });

        let actionMessage;
        if (existingPrediction) {
            existingPrediction.prediction = {...response.data.score, advances: response.data.advances};
            await existingPrediction.save();
            actionMessage = CALLABLES.updateScorePrediction(interaction.user.id, match.team1, match.team2, sup);
        } else {
            await Prediction.create({
                userId: interaction.user.id,
                matchId: match._id,
                prediction: {...response.data.score, advances: response.data.advances}
            });
            actionMessage = CALLABLES.sendScorePrediction(interaction.user.id, match.team1, match.team2, sup);
        }

        if (
            interaction.channel &&
            'send' in interaction.channel &&
            typeof interaction.channel.send === 'function'
        ) {
            await interaction.channel.send(actionMessage);
        }

        await interaction.editReply({ content: `✅ ¡Se guardó tu predicción para el partido **${match.team1} vs. ${match.team2}${sup}**! Elegiste: **${response.data.score.team1}-${response.data.score.team2}**. ${response.data.advances ? `El equipo que avanza es: **${response.data[response.data.advances]}**.` : ''}` });
    } catch (error) {
        console.error('Error in send-score-prediction:', error);
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ content: '❌ Ocurrió un error al procesar tu predicción.' });
        } else {
            await interaction.reply({ content: '❌ Ocurrió un error al procesar tu predicción.', ephemeral: true });
        }
    }
};

export default sendScorePredictionCommand;