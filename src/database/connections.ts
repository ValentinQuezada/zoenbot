import mongoose from "mongoose";
import { MatchMongoose } from "../schemas/match";
import { PredictionSchema } from "../schemas/prediction";
import { UserStatsSchema } from "../schemas/user";
import { PollaMongoose } from "../schemas/polla"; // <-- agrega tu schema de Polla

let mongoClient: mongoose.Mongoose;
let mongoConnection: mongoose.Connection;

async function databaseConnection(){
    if (mongoConnection !== undefined) {
        return mongoConnection;
    }

    mongoClient = await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING!);
    mongoConnection = mongoClient.connection;

    // Register all schemas here
    mongoConnection.model('Match', MatchMongoose);
    mongoConnection.model('Prediction', PredictionSchema);
    mongoConnection.model('UserStats', UserStatsSchema);
    mongoConnection.model('Polla', PollaMongoose);

    mongoConnection.once("open", () => {
        console.log("Connected to MongoDB");
    });

    return mongoConnection;
}

export default databaseConnection;