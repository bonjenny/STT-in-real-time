import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // In production, set to client URL
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_note', (noteId: string) => {
      socket.join(noteId);
      console.log(`Socket ${socket.id} joined note ${noteId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const emitBlockUpdate = (noteId: string, action: string, data: any) => {
  if (io) {
    io.to(noteId).emit('block_update', { action, data });
  }
};
