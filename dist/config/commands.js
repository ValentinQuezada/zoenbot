"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const say_1 = __importDefault(require("../commands/say"));
const commands = [
    {
        name: 'hola',
        description: 'Saluda al bot'
    },
    {
        name: 'checkstock',
        description: 'Verifica el stock del producto'
    },
    say_1.default
];
exports.default = commands;
