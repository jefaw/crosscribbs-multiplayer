import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { socket } from "~/connections/socket";
import { useLobby } from "~/hooks/useLobby";

interface PlayerInfo {
  id: string;
  name: string;
}

export default function Lobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const lobbyId = location.state?.lobbyId;
  const { lobby, gameStarted, startGame } = useLobby(lobbyId);

  useEffect(() => {
    if (!lobbyId) {
      console.log("LOBBY: lobby id = ", lobbyId);
      navigate("/multiplayer-setup");
    }

    socket.on("gameStateUpdate", (gameState) => {
      // This means the game has started
      console.log("Game started, navigating to game page.", gameState);
      navigate(`/game/${lobbyId}`, { state: { lobbyId, initialGameState: gameState } });
    });

    return () => {
      socket.off("gameStateUpdate");
    };
  }, [lobbyId, navigate]);

  if (!lobby) return <div>Loading lobby...</div>;

  const myId = socket.id;
  const numPlayers = lobby.numPlayers;
  const isHost = lobby.host === myId;
  const canStartGame = lobby.players.length === numPlayers && isHost;

  console.log(`lobby.players.len = ${lobby.players.length} === lobby.numPlayers = ${lobby.numPlayers}`);

  const handleStartGame = () => {
    if (canStartGame) {
      socket.emit("startGame", { lobbyId, numPlayers });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-transparent bg-clip-text">
          Cross Cribbs
        </h1>
      </div>
      <div className="bg-slate-700 p-8 rounded-lg shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold text-white mb-6">Game Lobby</h2>
        <p className="text-white text-lg mb-4">
          Lobby ID: <span className="font-bold text-cyan-300">{lobbyId}</span>
        </p>
        {/* <p className="text-white text-lg mb-4">
          Game Mode: <span className="font-bold text-cyan-300">{gameMode}</span>
        </p> */}
        <p className="text-white text-lg mb-4">
          Players: {lobby.players.length} / {lobby.numPlayers}
        </p>
        <ul className="list-disc list-inside text-white mb-6">
          {lobby.players.map((player: any) => (
            <li key={player.id}>
              {/* {player.name} {lobby.host === player.id ? "(Host)" : ""} */}
              {player.name}
              {player.id === lobby.host && (
                <span className="bg-yellow-400 text-black px-2 rounded-full text-xs ml-2">Host</span>
              )}
              {player.id === myId && (
                <span className="bg-green-400 text-black px-2 rounded-full text-xs ml-2">You</span>
              )}
            </li>
          ))}
        </ul>

        {lobby.host && (
          <button
            onClick={handleStartGame}
            disabled={!canStartGame}
            className={`w-full font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 ${canStartGame ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 opacity-50 cursor-not-allowed"}`}
          >
            Start Game
          </button>
        )}

        <button
          onClick={() => navigate(-1)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 mt-4"
        >
          Back
        </button>
      </div>
    </div>
  );
}
