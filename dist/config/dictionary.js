"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALLABLES = void 0;
exports.CALLABLES = {
    sendScorePrediction: (userId, team1, team2, sup) => `*🎯​ ¡<@${userId}> ha enviado su resultado para **${team1} vs. ${team2}${sup}**!*`,
    updateScorePrediction: (userId, team1, team2, sup) => `*✏️​ ¡<@${userId}> ha actualizado su resultado para **${team1} vs. ${team2}${sup}**!*`,
    sendOtherPrediction: (ownerId, userId, team1, team2, sup) => `*🎯​ ¡<@${ownerId}> ha enviado el resultado de <@${userId}> para **${team1} vs. ${team2}${sup}**!*`,
    updateOtherPrediction: (ownerId, userId, team1, team2, sup) => `*✏️​ ¡<@${ownerId}> ha actualizado el resultado de <@${userId}> para **${team1} vs. ${team2}${sup}**!*`
};
