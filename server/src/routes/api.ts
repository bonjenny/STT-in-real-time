import express from 'express';
import multer from 'multer';
import path from 'path';
import { createNote, getNote, updateBlock } from '../controllers/noteController';
import { processAudioChunk } from '../controllers/audioController';

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.webm'); // Expecting webm from MediaRecorder
  }
});

const upload = multer({ storage: storage });

// Note Routes
router.post('/notes', createNote);
router.get('/notes/:id', getNote);

// Block Routes
router.put('/blocks/:id', updateBlock);

// Audio Route
router.post('/audio/stream', upload.single('audio'), processAudioChunk);

export default router;
