import Board from "~/ui/Game/Board";
import Player from "~/ui/Game/Player.js";
import RoundScore from "~/ui/Game/RoundScore";
import GameOver from "~/ui/Game/GameOver";
import TurnIndicator from "~/ui/Game/TurnIndicator";
import RoundHistory from "~/ui/Game/RoundHistory";
import Crib from "~/ui/Game/Crib";
import { useEffect, useState } from "react";
import type { GameStateType } from "@cross-cribbs/shared-types/GameControllerTypes";
import type { BoardPosition } from "@cross-cribbs/shared-types/BoardTypes";
import { socket } from "../connections/socket";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PlayersDisplay from "~/ui/Game/PlayersDisplay";
import Header from "~/ui/Game/Header";

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lobbyId } = useParams();
  const { initialGameState } = location.state || {}; // get initial game state from lobby or menu
  let { gameType, numPlayers, playerNames } = location.state || {}; // set local settings
  const [gameState, setGameState] = useState<GameStateType | null>(initialGameState || null);

  console.log("lobby id = ", lobbyId);
  console.log("local p names = ", playerNames);
  console.log("local num ps = ", numPlayers);
  useEffect(() => {
    console.log("location.state: ", location.state);

    const handleGameUpdate = (state: GameStateType) => {
      console.log("Game state updated", state);
      setGameState(state);
    };

    // Attach listeners
    socket.on("gameStateUpdate", handleGameUpdate);

    // Cleanup on unmount
    return () => {
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
      const playerId = socket.id;
      socket.emit("playCard", { lobbyId, pos, playerId });
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

  const cardSizes = {
    base: "w-[54.075px] h-[75.6px] max-w-[54.075px] max-h-[75.6px]",
    md: "md:w-[81.9px] md:h-[116.55px] md:max-h-[133.2px] md:max-w-[93.6px]",
    xl: "xl:w-[93.6px] xl:h-[133.2px]",
  };

  return (
    <div className="bg-green-600 h-screen flex flex-col">
      <Header totalScores={gameState.totalScores} backToMenu={handleBackToMenu} />
      <div className="flex-1 flex flex-col md:flex-row relative items-center justify-center gap-5 md:gap-7">
        <div className="w-full md:w-1/3">
          {/* <div className="flex justify-start mb-4 pt-2">
            {!gameState.gameOver && (
              <button
                onClick={handleBackToMenu}
                className="fixed top-4 left-4 z-10 bg-gray-600 hover:bg-gray-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm transition-colors duration-200"
              >
                Back to Menu
              </button>
            )}
          </div> */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-10">
              <PlayersDisplay
                lobbyId={lobbyId}
                numPlayers={numPlayers}
                playerNames={playerNames}
                players={gameState.players}
                turn={gameState.turn}
                crib={gameState.crib}
                cardSizes={cardSizes}
              ></PlayersDisplay>
              <TurnIndicator
                className="hidden md:block"
                turn={gameState.turn}
                playerNames={playerNames}
                dealer={gameState.dealer}
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <Board board={gameState.board} playCard={playCard} turn={gameState.turn} cardSizes={cardSizes} />
        </div>
        <div className="md:w-1/3">
          <div className="flex justify-center">
            <div className="inline-flex flex-col items-center gap-10">
              <Crib crib={gameState.crib} dealer={gameState.dealer} cardSizes={cardSizes} />
              <RoundHistory roundHistory={gameState.roundHistory} />
            </div>
          </div>
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
        {/* {!gameState.gameOver && <BottomHud gameState={gameState} playerNames={playerNames} />} */}
      </div>
    </div>
  );
}
