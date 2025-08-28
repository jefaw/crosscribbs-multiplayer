import React from 'react';

interface TotalScoreBarProps {
  totalScores: [number, number];
  playerNames: string[];
  onBackToMenu: () => void;
  onInstructions: () => void;
}

const TotalScoreBar: React.FC<TotalScoreBarProps> = ({ totalScores, playerNames, onBackToMenu, onInstructions }) => {
  return (
    <div className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>
        <button
          onClick={onBackToMenu}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200 mr-2"
        >
          Back to Menu
        </button>
        <button
          onClick={onInstructions}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200"
        >
          Instructions
        </button>
      </div>
      <div className="text-2xl font-bold">
        Cross Cribbs
      </div>
      <div className="flex items-center text-xl font-bold">
        Total Score:
        <span className="ml-4 text-cyan-400">Row: {totalScores[0] || 0}</span>
        <span className="ml-4 text-fuchsia-400">Column: {totalScores[1] || 0}</span>
      </div>
    </div>
  );
};

export default TotalScoreBar;
