import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICoach extends Document {
  name?: string;
  dateOfBirth?: string;
  nationality?: string;
  team: Types.ObjectId;
}

const CoachSchema = new Schema<ICoach>({
  name: { type: String },
  dateOfBirth: { type: String },
  nationality: { type: String },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
});

export default mongoose.model<ICoach>('Coach', CoachSchema);
