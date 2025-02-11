import mongoose, { Document, Schema } from 'mongoose';

export interface ICompetition extends Document {
  name: string;
  code: string;
  areaName: string;
}

const CompetitionSchema = new Schema<ICompetition>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  areaName: { type: String, required: true },
});

export default mongoose.model<ICompetition>('Competition', CompetitionSchema);
