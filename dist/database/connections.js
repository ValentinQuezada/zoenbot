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
const mongoose_1 = __importDefault(require("mongoose"));
const match_1 = require("../schemas/match");
const prediction_1 = require("../schemas/prediction");
const user_1 = require("../schemas/user");
const polla_1 = require("../schemas/polla"); // <-- agrega tu schema de Polla
let mongoClient;
let mongoConnection;
function databaseConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongoConnection !== undefined) {
            return mongoConnection;
        }
        mongoClient = yield mongoose_1.default.connect(process.env.MONGO_DB_CONNECTION_STRING);
        mongoConnection = mongoClient.connection;
        // Register all schemas here
        mongoConnection.model('Match', match_1.MatchMongoose);
        mongoConnection.model('Prediction', prediction_1.PredictionSchema);
        mongoConnection.model('UserStats', user_1.UserStatsSchema);
        mongoConnection.model('Polla', polla_1.PollaMongoose);
        mongoConnection.once("open", () => {
            console.log("Connected to MongoDB");
        });
        return mongoConnection;
    });
}
exports.default = databaseConnection;
