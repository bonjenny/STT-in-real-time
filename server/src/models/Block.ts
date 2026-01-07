import mongoose, { Document, Schema } from 'mongoose';

export interface IBlock extends Document {
  noteId: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'code' | 'header'; // Simplified types
  order: number;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema: Schema = new Schema({
  noteId: { type: Schema.Types.ObjectId, ref: 'Note', required: true },
  content: { type: String, default: '' },
  type: { type: String, enum: ['text', 'code', 'header'], default: 'text' },
  order: { type: Number, required: true },
  isLocked: { type: Boolean, default: false },
}, { timestamps: true });

// Optimistic locking using version key is default in Mongoose (__v)
// But for pessimistic locking logic (UI), we use isLocked field.

export default mongoose.model<IBlock>('Block', BlockSchema);
