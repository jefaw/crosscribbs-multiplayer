import React from 'react';

interface GameNavBarProps {
  onBackToMenu: () => void;
  onInstructions: () => void;
}

const GameNavBar: React.FC<GameNavBarProps> = ({ onBackToMenu, onInstructions }) => {
  return (
    <div className="w-full bg-gray-800 text-white p-4 flex justify-around items-center">
      <button
        onClick={onBackToMenu}
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-lg transition-colors duration-200"
      >
        Back to Menu
      </button>
      <button
        onClick={onInstructions}
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-lg transition-colors duration-200"
      >
        Instructions
      </button>
    </div>
  );
};

export default GameNavBar;
