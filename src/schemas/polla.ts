import { Schema, Document, Types, model } from "mongoose";
import { MatchDocument } from "./match";
import { UserStatsDocument } from "./user";

// Equipo
export interface Team {
  name: string;
  alias: string;
}
const TeamSchema = new Schema<Team>({
  name: { type: String, required: true },
  alias: { type: String, required: true }
}, { _id: false });

// Documento de la Polla
export interface PollaDocument extends Document {
  name: string;
  teams: Team[];
  matches: Types.ObjectId[]; // Referencias a Match
  users: Types.ObjectId[];   // Referencias a User
  createdAt: Date;
  status: 'open' | 'closed' | 'in_progress';
}

export const PollaMongoose = new Schema<PollaDocument>({
  name:      { type: String, required: true },
  teams:     { type: [TeamSchema], required: true },
  matches:   [{ type: Schema.Types.ObjectId, ref: 'Match', required: true }],
  users:     [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  createdAt: { type: Date, default: Date.now },
  status:    { type: String, enum: ['open', 'closed', 'in_progress'], default: 'open' }
}, {
  timestamps: true
});

export const Polla = model<PollaDocument>("Polla", PollaMongoose);