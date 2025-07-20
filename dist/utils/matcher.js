"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFromCodeblock = extractFromCodeblock;
exports.markerToDuple = markerToDuple;
function extractFromCodeblock(text) {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) {
        return match[1];
    }
    const match2 = text.match(/```\s*([\s\S]*?)\s*```/);
    if (match2) {
        return match2[1];
    }
    return text;
}
function markerToDuple(marker) {
    const match = marker.match(/(\d+)[^\d]+(\d+)/);
    if (match) {
        const num1 = parseInt(match[1], 10);
        const num2 = parseInt(match[2], 10);
        return [num1, num2];
    }
    throw new Error("Invalid marker format");
}
