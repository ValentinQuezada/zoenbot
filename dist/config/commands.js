"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const say_1 = __importDefault(require("../commands/say"));
const createMatch_1 = __importDefault(require("../commands/createMatch"));
const setGroupStageOnly_1 = __importDefault(require("../commands/setGroupStageOnly"));
const commands = [
    say_1.default,
    createMatch_1.default,
    setGroupStageOnly_1.default,
];
exports.default = commands;
