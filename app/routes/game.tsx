import Board from "~/ui/Game/Board";
import Player from "~/ui/Game/Player.js";
import RoundScore from "~/ui/Game/RoundScore";
import GameOver from "~/ui/Game/GameOver";
import TurnIndicator from "~/ui/Game/TurnIndicator";
import RoundHistory from "~/ui/Game/RoundHistory";
import BottomHud from "~/ui/Game/BottomHud";
import { useEffect, useState } from "react";
import type { GameStateType } from "@shared/types/GameControllerTypes";
import type { BoardPosition } from "@shared/types/BoardTypes";
import { socket } from "../connections/socket";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DealerSelection from "~/ui/GameSetup/DealerSelection";

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lobbyId } = useParams();
  let { gameType, numPlayers, playerNames } = location.state || {}; // set local settings
  const [gameState, setGameState] = useState<GameStateType | null>(null);

  console.log("lobby id = ", lobbyId);
  useEffect(() => {
    console.log("location.state: ", location.state);
    // Listener functions
    const handleConnect = () => {
      console.log("Game Started");
      socket.emit("startGame", { lobbyId, numPlayers });
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

  let isMultiplayer = false;
  if (gameState.lobby) {
    numPlayers = gameState.lobby.numPlayers;
    playerNames = gameState.lobby.players.map((p) => p.name);
    isMultiplayer = true;
  }

  console.log("playerNames = ", playerNames);

  // if (!gameState.dealerSelectionComplete) {
  //   return <DealerSelection dealerSelectionCards={gameState.dealerSelectionCards} playerNames={playerNames} />;
  // }

  const handleResetGame = () => {
    const payload = { lobbyId: isMultiplayer ? lobbyId : undefined };
    socket.emit("resetGame", payload);
  };

  const handleBackToMenu = () => {
    handleResetGame();
    navigate("/");
  };

  const playCard = (pos: BoardPosition) => {
    if (isMultiplayer) {
      socket.emit("playCard", { lobbyId, pos });
    } else {
      socket.emit("playCard", { pos });
    }
  };

  const nextRound = () => {
    console.log("isMultiplayer = ", isMultiplayer);
    if (isMultiplayer) {
      socket.emit("nextRound", { lobbyId });
    } else {
      socket.emit("nextRound");
    }
  };

  return (
    <div className="bg-green-600">
      <div className="flex flex-col xl:flex-row relative">
        <div className="w-full xl:w-1/4">
          <div className="flex justify-start mb-4 pt-2">
            {!gameState.gameOver && (
              <button
                onClick={handleBackToMenu}
                className="fixed top-4 left-4 z-10 bg-gray-600 hover:bg-gray-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm transition-colors duration-200"
              >
                Back to Menu
              </button>
            )}
          </div>
          {numPlayers === 4 && (
            <>
              <Player
                name={playerNames[0]}
                player={gameState.player1}
                turn={gameState.turn}
                crib={gameState.crib}
                numPlayers={numPlayers}
              />
              <Player
                name={playerNames[2]}
                player={gameState.player3}
                turn={gameState.turn}
                crib={gameState.crib}
                numPlayers={numPlayers}
              />
            </>
          )}
          {numPlayers === 2 && (
            <Player
              name={playerNames[0]}
              player={gameState.player1}
              turn={gameState.turn}
              crib={gameState.crib}
              numPlayers={numPlayers}
            />
          )}
        </div>
        <div className="w-full xl:w-1/2">
          <Board board={gameState.board} selectedCard={gameState.selectedCard} playCard={playCard} />
        </div>
        <div className="w-full xl:w-1/4">
          {numPlayers === 4 && (
            <>
              <Player
                name={playerNames[1]}
                player={gameState.player2}
                turn={gameState.turn}
                crib={gameState.crib}
                numPlayers={numPlayers}
              />
              <Player
                name={playerNames[3]}
                player={gameState.player4}
                turn={gameState.turn}
                crib={gameState.crib}
                numPlayers={numPlayers}
              />
            </>
          )}
          {numPlayers === 2 && (
            <Player
              name={playerNames[1]}
              player={gameState.player2}
              turn={gameState.turn}
              crib={gameState.crib}
              numPlayers={numPlayers}
            />
          )}
        </div>
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
        {!gameState.gameOver && <BottomHud gameState={gameState} playerNames={playerNames} />}
        <RoundHistory roundHistory={gameState.roundHistory} />
      </div>
    </div>
  );
}
