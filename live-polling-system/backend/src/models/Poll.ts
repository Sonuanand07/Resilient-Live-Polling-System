import mongoose, { Schema, Document } from 'mongoose';

export interface IPoll extends Document {
  _id: string;
  teacherId: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  duration: number; // in seconds
  startedAt: Date;
  endedAt?: Date;
  isActive: boolean;
  studentResponses: Map<string, string>; // studentId -> selectedOptionId
  createdAt: Date;
  updatedAt: Date;
}

const pollSchema = new Schema<IPoll>({
  teacherId: { type: String, required: true },
  question: { type: String, required: true },
  options: [
    {
      id: { type: String, required: true },
      text: { type: String, required: true },
      votes: { type: Number, default: 0 }
    }
  ],
  duration: { type: Number, required: true, default: 60 },
  startedAt: { type: Date, required: true },
  endedAt: { type: Date },
  isActive: { type: Boolean, default: true },
  studentResponses: { type: Map, of: String, default: new Map() },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Poll = mongoose.model<IPoll>('Poll', pollSchema);
