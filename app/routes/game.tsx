import Board from "~/ui/Game/Board";
import Player from "~/ui/Game/Player.js";
import RoundScore from "~/ui/Game/RoundScore";
import GameOver from "~/ui/Game/GameOver";
import TurnIndicator from "~/ui/Game/TurnIndicator";
import RoundHistory from "~/ui/Game/RoundHistory";
import { useEffect, useState, useRef } from "react"; // Added useRef
import type { GameStateType } from "@shared/types/GameControllerTypes";
import type { BoardPosition } from "@shared/types/BoardTypes";
import { socket } from "../connections/socket";
import { useLocation, useNavigate } from "react-router-dom";

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameType, numPlayers, playerNames } = location.state || {};
  const [gameState, setGameState] = useState<GameStateType | null>(null);

  // Added for dynamic scaling
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState('top left');

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

    // Dynamic scaling logic
    const calculateScale = () => {
      if (gameContainerRef.current) {
        const gameWidth = gameContainerRef.current.offsetWidth; // Use offsetWidth for the base width
        const gameHeight = gameContainerRef.current.offsetHeight; // Use offsetHeight for the base height

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Target aspect ratio (width / height)
        const targetAspectRatio = gameWidth / gameHeight;

        let newScale = 1;

        // Calculate scale based on fitting within the window while maintaining aspect ratio
        const scaleX = windowWidth / gameWidth;
        const scaleY = windowHeight / gameHeight;

        // If the window is wider than the target aspect ratio, scale based on height
        if (windowWidth / windowHeight > targetAspectRatio) {
          newScale = scaleY;
        } else { // If the window is taller or has the same aspect ratio, scale based on width
          newScale = scaleX;
        }

        // Ensure we don't scale up beyond 1 (original size)
        newScale = Math.min(newScale, 1);

        setScale(newScale);
        setTransformOrigin('top left'); // Keep top left for now
      }
    };

    // Initial calculation
    calculateScale();

    // Recalculate on window resize
    window.addEventListener('resize', calculateScale);

    // Cleanup on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("gameStateUpdate", handleGameUpdate);
      window.removeEventListener('resize', calculateScale); // Cleanup resize listener
    };
  }, [location.state, numPlayers]); // Added numPlayers to dependency array

  if (!gameState) {
    return <div>Loading game...</div>;
  }

  const handleResetGame = () => {
    // resetGame();
  };

  const handleBackToMenu = () => {
    // onGameOver();
    socket.emit("resetGame");
    navigate("/");
  };

  const playCard = (pos: BoardPosition) => {
    socket.emit("playCard", pos);
  };

  const nextRound = () => {
    socket.emit("nextRound");
  };

  const hands = [gameState.hand1, gameState.hand2, gameState.hand3, gameState.hand4];

  return (
    <div className="bg-green-600 w-screen h-screen overflow-hidden">
      <div
        ref={gameContainerRef} // Added ref
        className="flex flex-col xl:flex-row relative min-h-0 flex-grow"
        style={{ transform: `scale(${scale})`, transformOrigin: transformOrigin }} // Applied dynamic style
      >
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
          {numPlayers === 4 && (
            <>
              <Player name={playerNames[0]} num={1} hand={hands[0]} turn={gameState.turn} />
              <Player name={playerNames[2]} num={3} hand={hands[2]} turn={gameState.turn} />
            </>
          )}
          {numPlayers === 2 && (
            <Player name={playerNames[0]} num={1} hand={hands[0]} turn={gameState.turn} />
          )}
        </div>
        <div className="w-full xl:w-1/2">
          <Board board={gameState.board} selectedCard={gameState.selectedCard} playCard={playCard} />
        </div>
        <div className="w-full xl:w-1/4">
          {numPlayers === 4 && (
            <>
              <Player name={playerNames[1]} num={2} hand={hands[1]} turn={gameState.turn} />
              <Player name={playerNames[3]} num={4} hand={hands[3]} turn={gameState.turn} />
            </>
          )}
          {numPlayers === 2 && (
            <Player name={playerNames[1]} num={2} hand={hands[1]} turn={gameState.turn} />
          )}
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
          <TurnIndicator turn={gameState.turn} playerNames={playerNames} />
        )}
        <RoundHistory roundHistory={gameState.roundHistory} />
      </div>
    </div>
  );
}
