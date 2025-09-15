// gameHelpers.ts

import type GameController from "server/gameController";

// Export games map so all handlers can share it
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
