import { useState } from 'react';

export default function Menu({ onStartGame }) {
  const [currentPage, setCurrentPage] = useState('main'); // main, gameType, playerSetup
  const [gameType, setGameType] = useState(null); // 'local' or 'online'
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const handleGameTypeSelect = (type) => {
    setGameType(type);
    setCurrentPage('gameType');
  };

  const handleModeSelect = (mode) => {
    if (mode === '1v1') {
      setCurrentPage('playerSetup');
    }
    // 2v2 will be handled later
  };

  const handleStartGame = () => {
    if (player1Name && player2Name) {
      onStartGame({ player1Name, player2Name });
    }
  };

  const renderMainMenu = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Select Game Type</h2>
      <button
        onClick={() => handleGameTypeSelect('local')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        Local Multiplayer
      </button>
      <button
        onClick={() => handleGameTypeSelect('online')}
        className="w-full bg-gray-500 text-white font-bold py-3 px-6 rounded-lg text-lg opacity-50 cursor-not-allowed"
        disabled
      >
        Online Multiplayer (Coming Soon)
      </button>
    </div>
  );

  const renderGameTypeMenu = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Select Game Mode</h2>
      <button
        onClick={() => handleModeSelect('1v1')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        1v1
      </button>
      <button
        onClick={() => handleModeSelect('2v2')}
        className="w-full bg-gray-500 text-white font-bold py-3 px-6 rounded-lg text-lg opacity-50 cursor-not-allowed"
        disabled
      >
        2v2 (Coming Soon)
      </button>
      <button
        onClick={() => setCurrentPage('main')}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-base transition-colors duration-200"
      >
        Back
      </button>
    </div>
  );

  const renderPlayerSetup = () => (
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
          onClick={handleStartGame}
          disabled={!player1Name || !player2Name}
          className={`w-full font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 ${
            player1Name && player2Name
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-500 text-white opacity-50 cursor-not-allowed'
          }`}
        >
          Start Game
        </button>
        <button
          onClick={() => setCurrentPage('gameType')}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-base transition-colors duration-200"
        >
          Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-transparent bg-clip-text">
          Cross Cribbs
        </h1>
      </div>

      <div className="bg-slate-700 p-8 rounded-lg shadow-xl w-[400px]">
        {currentPage === 'main' && renderMainMenu()}
        {currentPage === 'gameType' && renderGameTypeMenu()}
        {currentPage === 'playerSetup' && renderPlayerSetup()}
      </div>
    </div>
  );
} 