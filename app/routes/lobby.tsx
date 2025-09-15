import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { socket } from "~/connections/socket";

interface PlayerInfo {
  id: string;
  name: string;
}

export default function Lobby() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerInfo[]>(location.state?.players || []);
  const [hostId, setHostId] = useState<string>(location.state?.hostId || "");
  const [maxPlayers, setMaxPlayers] = useState<number>(location.state?.maxPlayers || 0);
  const [gameMode, setGameMode] = useState<string>(location.state?.gameMode || "");

  const isHost = socket.id === hostId;
  const canStartGame = players.length === maxPlayers && isHost;

  useEffect(() => {
    if (!gameId) {
      navigate("/multiplayer-setup");
      return;
    }

    socket.on("playerJoined", ({ playerId, players: updatedPlayers }) => {
      console.log(`Player ${playerId} joined the lobby.`);
      setPlayers(updatedPlayers);
    });

    socket.on("playerLeft", ({ playerId, players: updatedPlayers }) => {
      console.log(`Player ${playerId} left the lobby.`);
      setPlayers(updatedPlayers);
    });

    socket.on("gameStateUpdate", (gameState) => {
      // This means the game has started
      console.log("Game started, navigating to game page.", gameState);
      navigate(`/game/${gameId}`, { state: { gameId, gameState } });
    });

    // If navigating directly to lobby, try to get game info
    if (players.length === 0 && gameId) {
      socket.emit("getLobbyInfo", { gameId });
    }

    return () => {
      socket.off("playerJoined");
      socket.off("playerLeft");
      socket.off("gameStateUpdate");
    };
  }, [gameId, navigate, players.length]);

  const handleStartGame = () => {
    if (canStartGame) {
      socket.emit("startGame", { gameId });
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
          Game ID: <span className="font-bold text-cyan-300">{gameId}</span>
        </p>
        <p className="text-white text-lg mb-4">
          Game Mode: <span className="font-bold text-cyan-300">{gameMode}</span>
        </p>
        <p className="text-white text-lg mb-4">
          Players: {players.length} / {maxPlayers}
        </p>
        <ul className="list-disc list-inside text-white mb-6">
          {players.map((player) => (
            <li key={player.id}>
              {player.name} {player.id === hostId && "(Host)"}
            </li>
          ))}
        </ul>

        {isHost && (
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
