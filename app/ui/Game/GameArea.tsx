import React from 'react';
import Board from "~/ui/Game/Board";
import Player from "~/ui/Game/Player.js";
import TurnIndicator from "~/ui/Game/TurnIndicator";
import RoundHistoryBox from "~/ui/Game/RoundHistoryBox";
import Crib from "~/ui/Game/Crib";
import type { GameStateType } from "@shared/types/GameControllerTypes";
import type { BoardPosition } from "@shared/types/BoardTypes";

interface GameAreaProps {
  gameState: GameStateType;
  playerNames: string[];
  numPlayers: number;
  playCard: (pos: BoardPosition) => void;
}

const GameArea: React.FC<GameAreaProps> = ({
  gameState,
  playerNames,
  numPlayers,
  playCard,
}) => {
  return (
    <div className="max-w-full mx-auto px-4">
      <div className="flex flex-col xl:flex-row relative gap-x-8 mt-4">
        {/* Left Section: Turn/Player Area */}
        <div className="w-full xl:w-1/3">
          <TurnIndicator turn={gameState.turn} playerNames={playerNames} dealer={gameState.dealer} />
          <div className="mt-4">
            {numPlayers === 4 && (
              <>
                <h3 className="text-lg font-bold text-white mb-2">Row Team</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Player
                    name={playerNames[0]}
                    player={gameState.player1}
                    turn={gameState.turn}
                    crib={gameState.crib}
                    numPlayers={numPlayers}
                  />
                  <Player
                    name={playerNames[1]}
                    player={gameState.player2}
                    turn={gameState.turn}
                    crib={gameState.crib}
                    numPlayers={numPlayers}
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Column Team</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Player
                    name={playerNames[2]}
                    player={gameState.player3}
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
                </div>
              </>
            )}
            {numPlayers === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <Player
                  name={playerNames[0]}
                  player={gameState.player1}
                  turn={gameState.turn}
                  crib={gameState.crib}
                  numPlayers={numPlayers}
                />
                <Player
                  name={playerNames[1]}
                  player={gameState.player2}
                  turn={gameState.turn}
                  crib={gameState.crib}
                  numPlayers={numPlayers}
                />
              </div>
            )}
          </div>
        </div>

        {/* Middle Section: Game Board Grid */}
        <div className="w-[800px] flex items-center">
          <Board board={gameState.board} selectedCard={gameState.selectedCard} playCard={playCard} />
        </div>

        {/* Right Section: Crib/Round History */}
        <div className="w-full xl:w-1/3">
          <Crib cribCards={gameState.crib || []} />
          <RoundHistoryBox roundHistory={gameState.roundHistory} />
        </div>
      </div>
    </div>
  );
};

export default GameArea;
