// gameHelpers.ts

import type GameController from "server/gameController";

interface Player {
  id: string;
  name: string;
}

interface Lobby {
  players: Player[];
  host: string;
  numPlayers: number;
}

// Export lobbies and games maps so all handlers can share it
export const lobbies: Record<string, Lobby> = {}; // { lobbyId: { players: [], host: socketId }}
export const games: Record<string, GameController> = {};

/**
 * Returns the correct game instance.
 * If lobbyId is provided, returns the multiplayer game.
 * Otherwise, returns the local game for this socket.
 */
export function getGame(socketId: string, lobbyId?: string): GameController | null {
  const id = lobbyId || socketId;
  return games[id] || null;
}

/**
 * Optional: delete a game when a socket disconnects
 */
export function deleteGame(socketId: string, lobbyId?: string) {
  const id = lobbyId || socketId;
  delete games[id];
}
