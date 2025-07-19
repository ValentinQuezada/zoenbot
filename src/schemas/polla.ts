import { Schema, Document, Types } from "mongoose";
import { MatchDocument } from "./match"; // Importa tu MatchDocument
import { UserStatsDocument } from "./user"; // Importa tu UserDocument/StatsDocument

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
  matches: Types.DocumentArray<MatchDocument>; // o Types.ObjectId[] si usas ref
  users: Types.DocumentArray<UserStatsDocument>;
  createdAt: Date;
  status: 'open' | 'closed' | 'in_progress';
}

export const PollaSchema = new Schema<PollaDocument>({
  name:     { type: String, required: true },
  teams:    { type: [TeamSchema], required: true },
  matches:  [{ type: Schema.Types.ObjectId, ref: 'Match', required: true }], // Si usas ref
  users:    [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],  // Si usas ref
  createdAt:{ type: Date, default: Date.now },
  status:   { type: String, enum: ['open', 'closed', 'in_progress'], default: 'open' }
});

import { model } from "mongoose";
export const Polla = model<PollaDocument>("Polla", PollaSchema);