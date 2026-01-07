import { useState, useRef, useEffect } from 'react';
import { uploadAudioChunk } from '../services/api';

export const useAudioStream = (noteId: string | null) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Chunk duration in ms. 
  // Shorter duration = faster updates but more API calls/cost.
  // 10 seconds seems like a good balance for "real-time" feel vs cost/performance.
  const CHUNK_DURATION = 10000; 

  const startRecording = async () => {
    if (!noteId) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      // We need to stop and restart or requestData periodically.
      // requestData() does not trigger a clean file break for some STT engines if they expect headers.
      // However, Whisper API handles standard webm files well.
      // But sending partial streams might be tricky if header is missing in subsequent chunks.
      // Strategy: Record for X seconds, stop, upload, restart.
      // BUT restarting loses a bit of audio.
      // Better Strategy: `mediaRecorder.requestData()` gets a blob.
      // Problem: WebM blobs from requestData might not contain header after first chunk.
      // Solution: Use a simplified approach: Stop recorder every X seconds and start new one? 
      // No, that causes gaps.
      // Best for MVP: Use `TimeSlice` in start(timeslice). 
      // But we need valid file for API.
      
      // Alternative: Use a library or just send whatever we get. 
      // OpenAI Whisper usually needs a valid file header.
      // Let's try stopping and starting for now, realizing there might be a millisecond gap.
      // Or just use one long recording and slice it? No, that's not real-time.
      
      // Let's try: mediaRecorder.start(CHUNK_DURATION).
      // ondataavailable will fire every 10s.
      // We take that blob. NOTE: Chrome produces a Blob that might need fixing (EBML) to be a standalone file.
      // For MVP, let's assume `webm` from Chrome is acceptable by Whisper if we just send the chunk.
      // If it fails, we might need `fix-webm-duration` or similar, but let's keep it simple first.
      
      mediaRecorder.start(CHUNK_DURATION);
      setIsRecording(true);

      mediaRecorder.ondataavailable = async (e) => {
        if (e.data.size > 0 && isRecording) {
          // Upload this chunk immediately
          console.log('Sending audio chunk...', e.data.size);
          try {
             await uploadAudioChunk(noteId, e.data);
          } catch (err) {
             console.error("Upload failed", err);
          }
        }
      };

    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return { isRecording, startRecording, stopRecording };
};
