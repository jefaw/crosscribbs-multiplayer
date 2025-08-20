import { useState } from "react";

type ChildProps = {
  numPlayers: 2 | 4;
  onSetPlayerNames: (playerNames: [String, String]) => void;
  onBack: () => void;
};

export default function PlayerSetup({ onSetPlayerNames, onBack }: ChildProps) {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Enter Player Names</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-white text-sm font-bold mb-2" htmlFor="player1">
            Player 1 Name
          </label>
          <input
            type="text"
            id="player1"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Player 1 name"
          />
        </div>
        <div>
          <label className="block text-white text-sm font-bold mb-2" htmlFor="player2">
            Player 2 Name
          </label>
          <input
            type="text"
            id="player2"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Player 2 name"
          />
        </div>
      </div>
      <div className="space-y-2">
        <button
          onClick={() => onSetPlayerNames([player1Name, player2Name])}
          disabled={!player1Name || !player2Name}
          className={`w-full font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 ${
            player1Name && player2Name
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-500 text-white opacity-50 cursor-not-allowed"
          }`}
        >
          Start Game
        </button>
      </div>
      <button
        onClick={() => onBack()}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-base transition-colors duration-200"
      >
        Back
      </button>
    </div>
  );
}
