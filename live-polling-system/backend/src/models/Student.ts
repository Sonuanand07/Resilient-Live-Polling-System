import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  _id: string;
  sessionId: string;
  name: string;
  pollId: string;
  hasAnswered: boolean;
  selectedOption: string;
  answeredAt: Date;
  joinedAt: Date;
  isRemoved: boolean;
}

const studentSchema = new Schema<IStudent>({
  sessionId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  pollId: { type: String, required: true },
  hasAnswered: { type: Boolean, default: false },
  selectedOption: { type: String },
  answeredAt: { type: Date },
  joinedAt: { type: Date, default: Date.now },
  isRemoved: { type: Boolean, default: false }
});

export const Student = mongoose.model<IStudent>('Student', studentSchema);
