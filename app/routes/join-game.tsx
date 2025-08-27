import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "~/connections/socket";

export default function JoinGame() {
  const navigate = useNavigate();
  const [gameIdInput, setGameIdInput] = useState<string>("");
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    socket.on("playerJoined", ({ gameId, players }) => {
      console.log("Joined game:", gameId);
      navigate(`/lobby/${gameId}`, { state: { gameId, players } });
    });

    socket.on("joinGameFailed", (message) => {
      setJoinError(message);
    });

    return () => {
      socket.off("playerJoined");
      socket.off("joinGameFailed");
    };
  }, [navigate]);

  const handleJoinGame = () => {
    setJoinError(null); // Clear previous errors
    if (gameIdInput.trim()) {
      socket.emit("joinGame", { gameId: gameIdInput.trim() });
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
        <h2 className="text-2xl font-bold text-white mb-6">Join Game</h2>

        <div className="mb-4">
          <label htmlFor="gameId" className="block text-white text-lg font-bold mb-2">
            Enter Game ID:
          </label>
          <input
            type="text"
            id="gameId"
            value={gameIdInput}
            onChange={(e) => setGameIdInput(e.target.value.toUpperCase())}
            className="w-full p-2 rounded bg-slate-600 text-white"
            placeholder="e.g., ABCDEFG"
          />
          {joinError && <p className="text-red-400 text-sm mt-2">{joinError}</p>}
        </div>

        <button
          onClick={handleJoinGame}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
        >
          Join Game
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
