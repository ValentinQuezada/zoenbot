import { CreateMatchType, MatchDocument } from "../schemas/match";
import { MatchMongoose } from "../schemas/match";
import { PollaDocument, PollaMongoose } from "../schemas/polla";
import databaseConnection from "./connections";

export async function createMatch(match: CreateMatchType) {
    const dbClient = await databaseConnection();
    const response = await dbClient.model<MatchDocument>("Match", MatchMongoose).create(match);
    return response;
}

export async function createPolla(polla: CreateMatchType) {
    const dbClient = await databaseConnection();
    const response = await dbClient.model<PollaDocument>("Polla", PollaMongoose).create(polla);
    return response;
}