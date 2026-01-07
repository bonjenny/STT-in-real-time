import axios from 'axios';
import { Note, NoteWithBlocks, Block } from '../types';

const API_URL = 'http://localhost:5000/api';

export const createNote = async (title: string): Promise<Note> => {
  const response = await axios.post(`${API_URL}/notes`, { title });
  return response.data;
};

export const getNote = async (id: string): Promise<NoteWithBlocks> => {
  const response = await axios.get(`${API_URL}/notes/${id}`);
  return response.data;
};

export const updateBlock = async (id: string, data: Partial<Block>): Promise<Block> => {
  const response = await axios.put(`${API_URL}/blocks/${id}`, data);
  return response.data;
};

export const uploadAudioChunk = async (noteId: string, audioBlob: Blob): Promise<void> => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'chunk.webm');
  formData.append('noteId', noteId);
  
  await axios.post(`${API_URL}/audio/stream`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
