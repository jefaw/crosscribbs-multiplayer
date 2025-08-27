import GameController from "./gameController";
import { Server, Socket } from "socket.io";

interface GameLobby {
  gameId: string;
  hostId: string;
  players: { id: string; name: string }[];
  gameController: GameController;
  maxPlayers: number;
  gameMode: string; // e.g., 'standard', 'cribbage-go'
}

class GameManager {
  private activeGames: Map<string, GameLobby>;
  private io: Server;

  constructor(io: Server) {
    this.activeGames = new Map();
    this.io = io;
  }

  public createGame(hostId: string, maxPlayers: number, gameMode: string): string {
    const gameId = this.generateGameId();
    const gameController = new GameController(maxPlayers); // Initialize with maxPlayers
    const newGame: GameLobby = {
      gameId,
      hostId,
      players: [{ id: hostId, name: `Player ${hostId.substring(0, 4)}` }], // Host joins automatically
      gameController,
      maxPlayers,
      gameMode,
    };
    this.activeGames.set(gameId, newGame);
    console.log(`Game ${gameId} created by ${hostId}`);
    return gameId;
  }

  public joinGame(gameId: string, playerId: string): boolean {
    const game = this.activeGames.get(gameId);
    if (game && game.players.length < game.maxPlayers) {
      game.players.push({ id: playerId, name: `Player ${playerId.substring(0, 4)}` });
      console.log(`Player ${playerId} joined game ${gameId}`);
      return true;
    }
    return false;
  }

  public getGame(gameId: string): GameLobby | undefined {
    return this.activeGames.get(gameId);
  }

  public removePlayerFromGame(gameId: string, playerId: string): void {
    const game = this.activeGames.get(gameId);
    if (game) {
      game.players = game.players.filter((p) => p.id !== playerId);
      if (game.players.length === 0) {
        this.activeGames.delete(gameId);
        console.log(`Game ${gameId} removed as all players left.`);
      } else {
        console.log(`Player ${playerId} left game ${gameId}. Remaining players: ${game.players.length}`);
      }
    }
  }

  public handlePlayerDisconnect(playerId: string): void {
    this.activeGames.forEach((game, gameId) => {
      if (game.players.some(p => p.id === playerId)) {
        this.removePlayerFromGame(gameId, playerId);
        this.io.to(gameId).emit("playerLeft", { playerId, players: game.players });
      }
    });
  }

  private generateGameId(): string {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
  }
}

export default GameManager;
