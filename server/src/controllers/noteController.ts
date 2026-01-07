import { Request, Response } from 'express';
import Note from '../models/Note';
import Block, { IBlock } from '../models/Block';
import { emitBlockUpdate } from '../services/socketService';

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const note = await Note.create({ title });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error });
  }
};

export const getNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    const blocks = await Block.find({ noteId: id }).sort({ order: 1 });
    res.json({ note, blocks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note', error });
  }
};

export const updateBlock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, type, isLocked } = req.body;
    
    const block = await Block.findById(id);
    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }

    // Pessimistic Lock Check: If locked by AI (or another process) and we try to edit
    // Ideally we check who locked it, but for now just isLocked status.
    // If user wants to edit, isLocked should be false or they are unlocking it?
    // Simplified: Users can edit any block. AI locks block while generating (not implemented yet fully).
    
    block.content = content !== undefined ? content : block.content;
    block.type = type !== undefined ? type : block.type;
    block.isLocked = isLocked !== undefined ? isLocked : block.isLocked;
    
    await block.save();
    
    // Notify clients
    emitBlockUpdate(block.noteId.toString(), 'update', block);
    
    res.json(block);
  } catch (error) {
    res.status(500).json({ message: 'Error updating block', error });
  }
};
