import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "~/connections/socket";
import { useLobby } from "~/hooks/useLobby";
import BackButton from "~/ui/GameSetup/BackButton";

export default function JoinGame() {
  const navigate = useNavigate();
  const { joinLobby } = useLobby();
  const [username, setUsername] = useState("");
  const [lobbyId, setLobbyId] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleJoinGame = async () => {
    try {
      await joinLobby(lobbyId, username);
      navigate("/lobby", {
        state: { lobbyId },
      });
    } catch (err: any) {
      alert(err);
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
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Join Game</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-white text-lg font-bold mb-2">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-slate-600 text-white"
            placeholder="i.e BillyTheKid"
          />
          {joinError && <p className="text-red-400 text-sm mt-2">{joinError}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="gameId" className="block text-white text-lg font-bold mb-2">
            Enter Game ID:
          </label>
          <input
            type="text"
            id="lobbyId"
            value={lobbyId}
            onChange={(e) => setLobbyId(e.target.value)}
            className="w-full p-2 rounded bg-slate-600 text-white"
            placeholder="i.e 2"
          />
          {joinError && <p className="text-red-400 text-sm mt-2">{joinError}</p>}
        </div>

        <button
          onClick={handleJoinGame}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 mb-4"
        >
          Join Game
        </button>

        <BackButton />
      </div>
    </div>
  );
}
