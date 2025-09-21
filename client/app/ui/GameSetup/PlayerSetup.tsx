import { useState } from "react";

type ChildProps = {
  numPlayers: 2 | 4;
  onSetPlayerNames: (playerNames: string[]) => void;
  onBack: () => void;
};

export default function PlayerSetup({ numPlayers, onSetPlayerNames, onBack }: ChildProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(() => Array.from({ length: numPlayers }, () => ""));

  const handleNameChange = (index: number, name: string) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const allNamesEntered = playerNames.every((name) => name.trim() !== "");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Enter Player Names</h2>
      <div className="space-y-4">
        {playerNames.map((name, index) => (
          <div key={index}>
            <label className="block text-white text-sm font-bold mb-2" htmlFor={`player${index + 1}`}>
              Player {index + 1} Name
            </label>
            <input
              type="text"
              id={`player${index + 1}`}
              value={name.toString()}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter Player ${index + 1} name`}
            />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <button
          onClick={() => onSetPlayerNames(playerNames)}
          disabled={!allNamesEntered}
          className={`w-full font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 ${
            allNamesEntered
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
