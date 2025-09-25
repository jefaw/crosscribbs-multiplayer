import Crib from "./Crib";
import TurnIndicator from "./TurnIndicator";
import type { GameStateType } from "@cross-cribbs/shared-types/GameControllerTypes";

interface BottomHudProps {
  gameState: GameStateType;
  playerNames: string[];
}

export default function BottomHud({ gameState, playerNames }: BottomHudProps) {
  return (
    <div className="fixed h-29 bottom-4 left-4 flex items-end space-x-4">
      <TurnIndicator turn={gameState.turn} playerNames={playerNames} dealer={gameState.dealer} />
      <Crib crib={gameState.crib} dealer={gameState.dealer} />
    </div>
  );
}
