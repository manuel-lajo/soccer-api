import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  position?: string;
  dateOfBirth?: string;
  nationality?: string;
  team: Types.ObjectId;
}

const PlayerSchema = new Schema<IPlayer>({
  name: { type: String, required: true },
  position: { type: String },
  dateOfBirth: { type: String },
  nationality: { type: String },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);
