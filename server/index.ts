// server/index.js
import express from "express";

import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import GameController from "./gameController";
import GameManager from "./gameManager";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the client's build directory
app.use(express.static(path.join(__dirname, "..", "build", "client")));
app.use(express.static(path.join(__dirname, "..", "public"))); // Keep public for assets like cards
app.use(express.static(__dirname)); // Keep for server-side static assets if any

// Catch-all to serve index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "client", "index.html"));
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
  },
});

const gameManager = new GameManager(io);

const PORT = process.env.PORT || 4000;

// // Game testing interface route
// app.get("/test-game", (req, res) => {
//   res.sendFile(path.join(__dirname, "game-test-interface.html"));
// });

// Game state route for testing
app.get("/api/game/state", (req, res) => {
  // This would normally return the actual game state
  // For now, return a mock state
  res.json({
    status: "OK",
    message: "Game state endpoint working",
  });
});

// Simple game state for testing
const gameState = {
  message: "Waiting for players...",
};

// create a local 2 player game
let game: GameController;

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("hostGame", ({ maxPlayers, gameMode }) => {
    const gameId = gameManager.createGame(socket.id, maxPlayers, gameMode);
    socket.join(gameId);
    const game = gameManager.getGame(gameId);
    if (game) {
      io.to(gameId).emit("gameHosted", { gameId, hostId: socket.id, players: game.players, maxPlayers: game.maxPlayers, gameMode: game.gameMode });
      io.to(gameId).emit("gameStateUpdate", game.gameController.getGameState());
    }
  });

  socket.on("joinGame", ({ gameId }) => {
    const success = gameManager.joinGame(gameId, socket.id);
    if (success) {
      socket.join(gameId);
      const game = gameManager.getGame(gameId);
      if (game) {
        io.to(gameId).emit("playerJoined", { playerId: socket.id, players: game.players });
        io.to(gameId).emit("gameStateUpdate", game.gameController.getGameState());
      }
    } else {
      socket.emit("joinGameFailed", "Game not found or full.");
    }
  });

  socket.on("startGame", ({ gameId }) => {
    const game = gameManager.getGame(gameId);
    if (game) {
      // Assuming game start logic is within GameController or handled here
      // For now, just emit the current state
      io.to(gameId).emit("gameStateUpdate", game.gameController.getGameState());
      console.log(`Game ${gameId} Started`);
    }
  });

  socket.on("resetGame", ({ gameId }) => {
    const game = gameManager.getGame(gameId);
    if (game) {
      game.gameController.resetGame();
      io.to(gameId).emit("gameStateUpdate", game.gameController.getGameState());
    }
  });

  socket.on("selectCard", ({ gameId, player, card }) => {
    const game = gameManager.getGame(gameId);
    if (game) {
      const success = game.gameController.selectCard(player, card);
      if (success) io.to(gameId).emit("gameStateUpdate", game.gameController.getGameState());
    }
  });

  socket.on("playCard", ({ gameId, pos }) => {
    const game = gameManager.getGame(gameId);
    if (game) {
      const valid = game.gameController.isValidMove(pos);
      if (valid && game.gameController.playCard(pos)) {
        io.to(gameId).emit("gameStateUpdate", game.gameController.getGameState());
      } else {
        socket.emit("invalidMove");
      }
    }
  });

  socket.on("nextRound", ({ gameId }) => {
    const game = gameManager.getGame(gameId);
    if (game) {
      game.gameController.nextRound();
      io.to(gameId).emit("gameStateUpdate", game.gameController.getGameState());
    }
  });

  socket.on("selectDealer", ({ gameId, winningPlayer }) => {
    const game = gameManager.getGame(gameId);
    if (game) {
      game.gameController.selectDealer(winningPlayer);
      io.to(gameId).emit("gameStateUpdate", game.gameController.getGameState());
    }
  });

  socket.on("discardToCrib", ({ gameId, numPlayers, player, card }) => {
    const game = gameManager.getGame(gameId);
    if (game) {
      const success = game.gameController.discardToCrib(numPlayers, player, card);
      if (success) {
        io.to(gameId).emit("gameStateUpdate", game.gameController.getGameState());
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    gameManager.handlePlayerDisconnect(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Game testing interface available at: http://localhost:${PORT}/test-game`);
});
