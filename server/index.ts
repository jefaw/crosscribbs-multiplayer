import express from "express";

import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import GameController from "./gameController.js";
import { getGame, lobbies, games, deleteGame } from "./classes/gameHelpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors()); // {  origin: ["http://localhost:5173", "https://cross-cribbs.up.railway.app"], credentials: true,}
app.use(express.json());
// app.use(express.static(path.join(__dirname, "..", "public")));
// app.use(express.static(__dirname));

// Serve Vite frontend build
// const frontendPath = path.join(__dirname, "..", "client");
// app.use(express.static(frontendPath));
// console.log("frontendPath = ", frontendPath);

// // Handle frontend routes (React Router)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(frontendPath, "index.html"));
// });

// HTTP + Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://cross-cribbs-production.up.railway.app",
    ],
    methods: ["GET", "POST"],
  },
});

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

  socket.on("startGame", ({ lobbyId, numPlayers }) => {
    if (lobbyId) {
      // Multiplayer game tied to a lobby
      const lobby = lobbies[lobbyId] ?? null;
      games[lobbyId] = new GameController(numPlayers, lobby);
      const newGame = getGame(socket.id, lobbyId);
      if (!newGame) return;
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
  // socket.on("selectCard", ({ lobbyId, player, card }) => {
  //   const game = getGame(socket.id, lobbyId);
  //   if (!game) return;

  //   const success = game.selectCard(player, card);
  //   if (success) io.emit("gameStateUpdate", game.getGameState());
  // });

  // Handle "playCard" event
  socket.on("playCard", ({ lobbyId, playerId, pos }) => {
    const game = getGame(socket.id, lobbyId);
    if (!game) return;

    const success = game.applyMove(pos, playerId);

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
  socket.on("nextRound", (data = {}) => {
    const { lobbyId } = data;
    const game = getGame(socket.id, lobbyId);
    if (!game) return;

    game.nextRound();

    if (lobbyId) {
      // multiplayer
      io.emit("gameStateUpdate", game.getGameState());
    } else {
      // local
      socket.emit("gameStateUpdate", game.getGameState());
    }
  });

  socket.on("selectDealer", ({ lobbyId, winningPlayer }) => {
    const game = getGame(socket.id, lobbyId);
    if (!game) return;

    game.selectDealer(winningPlayer);
    io.emit("gameStateUpdate", game.getGameState());
  });

  socket.on("discardToCrib", ({ lobbyId, numPlayers, player, card, playerId }) => {
    const game = getGame(socket.id, lobbyId);
    if (!game) return;
    const success = game.discardToCrib(numPlayers, player, card, playerId);
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
