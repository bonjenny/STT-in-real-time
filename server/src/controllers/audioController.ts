import { Request, Response } from 'express';
import { transcribeAudio, processTextToBlocks } from '../services/openaiService';
import { deleteFile } from '../utils/fileHandler';
import Block from '../models/Block';
import { emitBlockUpdate } from '../services/socketService';
import mongoose from 'mongoose';

export const processAudioChunk = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { noteId } = req.body;
  const filePath = req.file.path;

  // Run in background to not block response? 
  // For Real-time, we want to acknowledge receipt quickly but process async.
  // However, user expects results. We'll await for now or use a queue in production.
  
  try {
    // 1. Transcribe
    const text = await transcribeAudio(filePath);
    
    if (!text || text.trim().length === 0) {
      deleteFile(filePath);
      return res.json({ message: 'No speech detected' });
    }

    // 2. Process to Blocks
    const blocksData = await processTextToBlocks(text);

    // 3. Save Blocks
    // Get current max order
    const lastBlock = await Block.findOne({ noteId }).sort({ order: -1 });
    let currentOrder = lastBlock ? lastBlock.order + 1 : 0;

    const newBlocks = [];
    for (const data of blocksData) {
      const block = await Block.create({
        noteId,
        content: data.content,
        type: data.type || 'text',
        order: currentOrder++,
        isLocked: false // Finalized block is unlocked
      });
      newBlocks.push(block);
    }

    // 4. Notify Clients
    if (newBlocks.length > 0) {
      emitBlockUpdate(noteId, 'create_batch', newBlocks);
    }

    // Cleanup
    deleteFile(filePath);
    
    res.json({ message: 'Processed successfully', blocks: newBlocks });

  } catch (error) {
    console.error('Audio processing error:', error);
    deleteFile(filePath); // Ensure cleanup
    res.status(500).json({ message: 'Error processing audio', error });
  }
};
