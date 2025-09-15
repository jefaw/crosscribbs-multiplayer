import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "~/connections/socket";

export default function HostGame() {
  const navigate = useNavigate();
  const [maxPlayers, setMaxPlayers] = useState<2 | 4>(2);
  const [gameMode, setGameMode] = useState<string>("standard"); // Default game mode

  useEffect(() => {
    socket.on("gameHosted", ({ gameId, hostId, players, maxPlayers, gameMode }) => {
      console.log("Game Hosted:", gameId);
      navigate(`/lobby/${gameId}`, { state: { gameId, hostId, players, maxPlayers, gameMode } });
    });

    return () => {
      socket.off("gameHosted");
    };
  }, [navigate]);

  const handleHostGame = () => {
    socket.emit("hostGame", { maxPlayers, gameMode });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-transparent bg-clip-text">
          Cross Cribbs
        </h1>
      </div>
      <div className="bg-slate-700 p-8 rounded-lg shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold text-white mb-6">Host Game</h2>

        <div className="mb-4">
          <label htmlFor="maxPlayers" className="block text-white text-lg font-bold mb-2">
            Max Players:
          </label>
          <select
            id="maxPlayers"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Number(e.target.value) as 2 | 4)}
            className="w-full p-2 rounded bg-slate-600 text-white"
          >
            <option value={2}>2 Players</option>
            <option value={4}>4 Players</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="gameMode" className="block text-white text-lg font-bold mb-2">
            Game Mode:
          </label>
          <select
            id="gameMode"
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
            className="w-full p-2 rounded bg-slate-600 text-white"
          >
            <option value="standard">Standard Cribbage</option>
            {/* Add other game modes here */}
          </select>
        </div>

        <button
          onClick={handleHostGame}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
        >
          Host Game
        </button>

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
