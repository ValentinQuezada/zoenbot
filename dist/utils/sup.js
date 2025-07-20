"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupLabels = getSupLabels;
exports.isExtraTime = isExtraTime;
const EXTRA_TIME_TYPES = new Set([
    "round-of-16-extra",
    "quarterfinal-extra",
    "semifinal-extra",
    "final-extra",
]);
function getSupLabels(matchType) {
    if (matchType && EXTRA_TIME_TYPES.has(matchType)) {
        return {
            sup: " (sup.)",
            SUPLE: " SUPLEMENTARIO",
        };
    }
    return { sup: "", SUPLE: "" };
}
function isExtraTime(matchType) {
    return !!matchType && EXTRA_TIME_TYPES.has(matchType);
}
