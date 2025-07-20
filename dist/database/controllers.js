"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMatch = createMatch;
exports.createPolla = createPolla;
const match_1 = require("../schemas/match");
const polla_1 = require("../schemas/polla");
const connections_1 = __importDefault(require("./connections"));
function createMatch(match) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbClient = yield (0, connections_1.default)();
        const response = yield dbClient.model("Match", match_1.MatchMongoose).create(match);
        return response;
    });
}
function createPolla(polla) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbClient = yield (0, connections_1.default)();
        const response = yield dbClient.model("Polla", polla_1.PollaMongoose).create(polla);
        return response;
    });
}
