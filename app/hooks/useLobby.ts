import { useEffect, useState } from "react";
import { socket } from "~/connections/socket";

export function useLobby(lobbyId?: string) {
  const [lobby, setLobby] = useState<any>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    socket.on("lobbyUpdate", (updatedLobby) => setLobby(updatedLobby));
    socket.on("gameStarted", () => setGameStarted(true));

    // Request initial lobby state
    socket.emit("getLobbyInfo", { lobbyId }, (response: any) => {
      if (response.error) {
        console.error("Failed to get lobby info:", response.error);
      } else {
        setLobby(response.lobby);
      }
    });

    return () => {
      socket.off("lobbyUpdate");
      socket.off("gameStarted");
    };
  }, []);

  const createLobby = (username: string, numPlayers: number) =>
    new Promise<{ lobbyId: string }>((resolve, reject) => {
      console.log("usecribbs create lobby");
      socket.emit("createLobby", username, numPlayers, (res: any) => {
        if (res.error) reject(res.error);
        else resolve(res);
      });
    });

  const joinLobby = (lobbyId: string, username: string) =>
    new Promise<{ lobbyId: string }>((resolve, reject) => {
      socket.emit("joinLobby", lobbyId, username, (res: any) => {
        if (res.error) reject(res.error);
        else resolve(res);
      });
    });

  const startGame = (lobbyId: string) => {
    socket.emit("startGame", lobbyId);
  };

  return { lobby, gameStarted, createLobby, joinLobby, startGame };
}
