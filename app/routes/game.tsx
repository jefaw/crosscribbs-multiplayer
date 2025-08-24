import Board from "~/ui/Game/Board";
import Player from "~/ui/Game/Player.js";
import RoundScore from "~/ui/Game/RoundScore";
import GameOver from "~/ui/Game/GameOver";
import TurnIndicator from "~/ui/Game/TurnIndicator";
import RoundHistory from "~/ui/Game/RoundHistory";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { GameStateType } from "@shared/types/GameControllerTypes";
import type { BoardPosition } from "@shared/types/BoardTypes";
import { socket } from "../connections/socket";

export default function Game() {
  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [player1Name, setPlayer1Name] = useState<string>("Player 1");
  const [player2Name, setPlayer2Name] = useState<string>("Player 2");

  useEffect(() => {
    // Listener functions
    const handleConnect = () => {
      console.log("Connected to server");
      socket.emit("startGame");
    };

    // if the socket is already connected, call it manually
    if (socket.connected) {
      handleConnect();
    }

    const handleGameUpdate = (state: GameStateType) => {
      console.log("Game state updated", state);
      setGameState(state);
    };

    // Attach listeners
    socket.on("connect", handleConnect);
    socket.on("gameStateUpdate", handleGameUpdate);

    // Cleanup on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("gameStateUpdate", handleGameUpdate);
    };
  }, []);

  if (!gameState) {
    return <div>Loading game...</div>;
  }

  const handleResetGame = () => {
    // resetGame();
  };

  const handleBackToMenu = () => {
    // resetGame();
    // onGameOver();
  };

  const playCard = (pos: BoardPosition) => {
    socket.emit("playCard", pos);
  };

  const nextRound = () => {
    socket.emit("nextRound");
  };

  return (
    /*
    Game Layout: 
      Player 1
      Board
      Player 2
     */
    <div className="bg-green-600">
      <div className="flex flex-col xl:flex-row relative">
        <div className="w-full xl:w-1/4">
          <div className="flex justify-start mb-4 pt-2">
            {!gameState.gameOver && (
              <button
                onClick={handleBackToMenu}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm transition-colors duration-200"
              >
                Back to Menu
              </button>
            )}
          </div>
          <Player name={"Player 1"} num={1} hand={gameState.hand1} turn={gameState.turn} />
        </div>
        <div className="w-full xl:w-1/2">
          <Board board={gameState.board} selectedCard={gameState.selectedCard} playCard={playCard} />
        </div>
        <div className="w-full xl:w-1/4">
          <Player name={"Player 2"} num={2} hand={gameState.hand2} turn={gameState.turn} />
        </div>
        {gameState.roundScoreVisible && !gameState.gameOver && (
          <RoundScore nextRound={nextRound} roundScores={gameState.roundScores} totalScores={gameState.totalScores} />
        )}
        {gameState.gameOver && (
          <GameOver
            winner={gameState.winner}
            totalScores={gameState.totalScores}
            resetGame={handleResetGame}
            roundHistory={gameState.roundHistory}
            onBackToMenu={handleBackToMenu}
          />
        )}
        {!gameState.gameOver && (
          <TurnIndicator turn={gameState.turn} player1Name={player1Name} player2Name={player2Name} />
        )}
        <RoundHistory roundHistory={gameState.roundHistory} />
      </div>
    </div>
  );
}
