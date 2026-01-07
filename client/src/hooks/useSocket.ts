import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Block } from '../types';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = (noteId: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  
  // Use ref to keep track of event handlers if needed, 
  // but for simple subscription, we can just expose the socket or latest updates.
  // Ideally, this hook manages the block state updates directly or exposes an event listener.
  
  // Let's expose an event subscription mechanism
  const onBlockUpdate = useRef<((action: string, data: any) => void) | null>(null);

  useEffect(() => {
    if (!noteId) return;

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      newSocket.emit('join_note', noteId);
    });

    newSocket.on('block_update', ({ action, data }: { action: string, data: any }) => {
      if (onBlockUpdate.current) {
        onBlockUpdate.current(action, data);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [noteId]);

  const subscribeToUpdates = (callback: (action: string, data: any) => void) => {
    onBlockUpdate.current = callback;
  };

  return { socket, subscribeToUpdates };
};
