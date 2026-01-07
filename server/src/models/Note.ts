import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true, default: 'Untitled Meeting' },
}, { timestamps: true });

export default mongoose.model<INote>('Note', NoteSchema);
