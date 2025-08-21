// server/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(__dirname));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow connections from your React app
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 4000;

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Game testing interface route
app.get('/test-game', (req, res) => {
  res.sendFile(path.join(__dirname, 'game-test-interface.html'));
});

// Game state route for testing
app.get('/api/game/state', (req, res) => {
  // This would normally return the actual game state
  // For now, return a mock state
  res.json({
    status: 'OK',
    message: 'Game state endpoint working'
  });
});

// Simple game state for testing
const gameState = {
  message: 'Waiting for players...',
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send the current game state to the new user
  socket.emit('gameStateUpdate', gameState);

  // Listen for a test message from the client
  socket.on('sendMessage', (data) => {
    console.log(`Received message from ${socket.id}: ${data}`);
    // Update the game state with the received message
    gameState.message = `Player ${socket.id} says: ${data}`;
    // Broadcast the updated state to all connected clients
    io.emit('gameStateUpdate', gameState);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Game testing interface available at: http://localhost:${PORT}/test-game`);
});
