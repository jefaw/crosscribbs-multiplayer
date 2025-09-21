// gameHelpers.ts
// Export lobbies and games maps so all handlers can share it
export const lobbies = {}; // { lobbyId: { players: [], host: socketId }}
export const games = {};
/**
 * Returns the correct game instance.
 * If lobbyId is provided, returns the multiplayer game.
 * Otherwise, returns the local game for this socket.
 */
export function getGame(socketId, lobbyId) {
    const id = lobbyId || socketId;
    return games[id] || null;
}
/**
 * Optional: delete a game when a socket disconnects
 */
export function deleteGame(socketId, lobbyId) {
    const id = lobbyId || socketId;
    delete games[id];
}
