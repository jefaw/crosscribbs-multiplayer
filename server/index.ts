// server/index.js
import express from "express";

import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import GameController from "./gameController";
import { getGame, lobbies, games, deleteGame } from "./classes/gameHelpers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.static(__dirname));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

let lobbyCounter = 1;

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Create Lobby
  socket.on("createLobby", (username, numPlayers, callback) => {
    console.log("test create lobby");
    const lobbyId = String(lobbyCounter++);
    lobbies[lobbyId] = {
      players: [{ id: socket.id, name: username }],
      host: socket.id,
      numPlayers,
    };
    socket.join(lobbyId);
    callback({ lobbyId });
    console.log(`lobby created: lobby id: ${lobbyId}`);
    io.to(lobbyId).emit("lobbyUpdate", lobbies[lobbyId]);
  });

  // Join Lobby
  socket.on("joinLobby", (lobbyId, username, callback) => {
    console.log("join lobby id: ", lobbyId);
    console.log("all lobbies = ", lobbies);
    const lobby = lobbies[lobbyId];

    if (!lobby) return callback({ error: "Lobby not found" });
    if (lobby.players.length >= lobby.numPlayers) return callback({ error: "Lobby full" });

    lobby.players.push({ id: socket.id, name: username });
    socket.join(lobbyId);
    callback({ lobbyId });
    io.to(lobbyId).emit("lobbyUpdate", lobby);
  });

  socket.on("getLobbyInfo", ({ lobbyId }, callback) => {
    const lobby = lobbies[lobbyId];
    if (!lobby) return callback({ error: "Lobby not found" });
    callback({ lobby });
  });

  socket.on("startGame", ({ numPlayers, lobbyId }) => {
    if (lobbyId) {
      // Multiplayer game tied to a lobby
      games[lobbyId] = new GameController(numPlayers);
      io.to(lobbyId).emit("gameStateUpdate", games[lobbyId].getGameState());
      console.log(`Multiplayer game started in lobby ${lobbyId}`);
    } else {
      // Local game (hosted just on this client)
      const localLobbyId = socket.id; // unique socket id i.e "42SXdaf123"
      games[localLobbyId] = new GameController(numPlayers);
      socket.emit("gameStateUpdate", games[localLobbyId].getGameState());
      console.log(`Local game started for ${socket.id}`);
    }
  });

  // Handle "startGame" event
  socket.on("resetGame", ({ lobbyId }) => {
    const game = getGame(socket.id, lobbyId);
    if (!game) return;

    game.resetGame();
    io.emit("gameStateUpdate", game.getGameState()); // broadcast to all clients
  });

  // Handle "selectCard" event
  socket.on("selectCard", ({ lobbyId, player, card }) => {
    const game = getGame(socket.id, lobbyId);
    if (!game) return;

    const success = game.selectCard(player, card);
    if (success) io.emit("gameStateUpdate", game.getGameState());
  });

  // Handle "playCard" event
  socket.on("playCard", ({ lobbyId, pos }) => {
    const game = getGame(socket.id, lobbyId);
    if (!game) return;

    const success = game.applyMove(pos);

    if (success) {
      if (lobbyId) {
        // multiplayer
        io.to(lobbyId).emit("gameStateUpdate", game.getGameState());
      } else {
        // local
        socket.emit("gameStateUpdate", game.getGameState());
      }
    } else {
      socket.emit("invalidMove");
    }
  });

  // Example: next round
  socket.on("nextRound", ({ lobbyId }) => {
    const game = getGame(socket.id, lobbyId);
    if (!game) return;

    game.nextRound();
    io.emit("gameStateUpdate", game.getGameState());
  });

  socket.on("selectDealer", ({ lobbyId, winningPlayer }) => {
    const game = getGame(socket.id, lobbyId);
    if (!game) return;

    game.selectDealer(winningPlayer);
    io.emit("gameStateUpdate", game.getGameState());
  });

  socket.on("discardToCrib", ({ lobbyId, numPlayers, player, card }) => {
    const game = getGame(socket.id, lobbyId);
    if (!game) return;
    const success = game.discardToCrib(numPlayers, player, card);
    if (success) {
      io.emit("gameStateUpdate", game.getGameState());
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Game testing interface available at: http://localhost:${PORT}/test-game`);
});
