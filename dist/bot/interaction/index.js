"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMatchCommand = exports.sayCommand = void 0;
const say_1 = __importDefault(require("./say"));
exports.sayCommand = say_1.default;
const createMatch_1 = __importDefault(require("./createMatch"));
exports.createMatchCommand = createMatch_1.default;
