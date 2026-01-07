import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import connectDB from './config/db';
import apiRoutes from './routes/api';
import { initSocket } from './services/socketService';
import { ensureUploadsDir } from './utils/fileHandler';

const app = express();
const httpServer = createServer(app);

// Connect Database
connectDB();

// Init Utils
ensureUploadsDir();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Socket.io
initSocket(httpServer);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
