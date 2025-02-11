import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  tla: string;
  shortName: string;
  areaName: string;
  address?: string;
  leagues: Types.ObjectId[];
  players?: Types.ObjectId[];
  coach?: Types.ObjectId | null;
}

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  tla: { type: String, required: true },
  shortName: { type: String, required: true },
  areaName: { type: String, required: true },
  address: { type: String },
  leagues: [{ type: Schema.Types.ObjectId, ref: 'Competition' }],
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  coach: { type: Schema.Types.ObjectId, ref: 'Coach' },
});

export default mongoose.model<ITeam>('Team', TeamSchema);
