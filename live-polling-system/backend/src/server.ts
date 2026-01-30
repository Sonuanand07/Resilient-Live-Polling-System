import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { connectDB } from './utils/database';
import { PollController } from './controllers/PollController';
import { PollSocketHandler } from './sockets/PollSocketHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

// Initialize Socket.io handlers
new PollSocketHandler(io);

// Controllers
const pollController = new PollController();

// Routes
app.post('/api/polls', (req: Request, res: Response) => pollController.createPoll(req, res));
app.get('/api/polls/teacher/:teacherId', (req: Request, res: Response) =>
  pollController.getActivePoll(req, res)
);
app.get('/api/polls/:pollId', (req: Request, res: Response) => pollController.getPollById(req, res));
app.post('/api/polls/vote', (req: Request, res: Response) => pollController.submitVote(req, res));
app.put('/api/polls/:pollId/end', (req: Request, res: Response) => pollController.endPoll(req, res));
app.get('/api/polls/history/:teacherId', (req: Request, res: Response) =>
  pollController.getPollHistory(req, res)
);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io listening on ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\nShutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
