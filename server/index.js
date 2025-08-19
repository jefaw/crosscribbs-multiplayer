// server/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow connections from your React app
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 4000;

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
});