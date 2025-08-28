import RoundScore from "~/ui/Game/RoundScore";
import GameOver from "~/ui/Game/GameOver";
import TotalScoreBar from "~/ui/Game/TotalScoreBar";
import GameNavBar from "~/ui/Game/GameNavBar";
import GameArea from "~/ui/Game/GameArea";
import { useEffect, useState } from "react";
import type { GameStateType } from "@shared/types/GameControllerTypes";
import type { BoardPosition } from "@shared/types/BoardTypes";
import { socket } from "../connections/socket";
import { useLocation, useNavigate } from "react-router-dom";
import DealerSelection from "~/ui/GameSetup/DealerSelection";

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameType, numPlayers, playerNames } = location.state || {};
  const [gameState, setGameState] = useState<GameStateType | null>(null);

  useEffect(() => {
    console.log("location.state: ", location.state);
    // Listener functions
    const handleConnect = () => {
      console.log("Game Started");
      socket.emit("startGame", { numPlayers });
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

  if (!gameState.dealerSelectionComplete) {
        return <DealerSelection dealerSelectionCards={gameState.dealerSelectionCards || []} playerNames={playerNames} />;
  }

  const handleResetGame = () => {
    // resetGame();
  };

  const handleBackToMenu = () => {
    // onGameOver();
    socket.emit("resetGame");
    navigate("/");
  };

  const handleInstructions = () => {
    console.log("Instructions button clicked");
    // TODO: Implement instructions display
  };

  const playCard = (pos: BoardPosition) => {
    socket.emit("playCard", pos);
  };

  const nextRound = () => {
    socket.emit("nextRound");
  };

  return (
    <div className="bg-green-600 flex flex-col h-screen">
      
      <TotalScoreBar
        totalScores={gameState.totalScores}
        playerNames={playerNames}
        onBackToMenu={handleBackToMenu}
        onInstructions={handleInstructions}
      />
      <GameArea gameState={gameState} playerNames={playerNames} numPlayers={numPlayers} playCard={playCard} />
      {gameState.roundScoreVisible && !gameState.gameOver && (
        <RoundScore
          nextRound={nextRound}
          roundScores={gameState.roundScores}
          totalScores={gameState.totalScores}
          cribScore={gameState.cribScore}
          dealer={gameState.dealer}
          crib={gameState.crib}
          board={gameState.board}
          heels={gameState.heels}
        />
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
    </div>
  );
}
