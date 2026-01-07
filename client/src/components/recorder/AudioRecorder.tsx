import React from 'react';
import { Mic, Square } from 'lucide-react';

interface AudioRecorderProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ isRecording, onStart, onStop }) => {
  return (
    <div className="flex items-center gap-4 p-4 border-t bg-white shadow-lg fixed bottom-0 w-full z-50">
      <button
        onClick={isRecording ? onStop : onStart}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all ${
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isRecording ? (
          <>
            <Square size={20} fill="currentColor" />
            <span>Stop Recording</span>
          </>
        ) : (
          <>
            <Mic size={20} />
            <span>Start Recording</span>
          </>
        )}
      </button>
      
      {isRecording && (
        <div className="flex items-center gap-2 text-red-500 animate-pulse">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="font-medium">Recording in progress...</span>
        </div>
      )}
    </div>
  );
};
