/*
- Spot component:
  - Handles drag and drop functionality
  - Shows either an empty spot or a played card
  - Manages card placement logic
*/

import type { BoardPosition } from "@cross-cribbs/shared-types/BoardTypes";
import type { CardSizesType, CardType } from "@cross-cribbs/shared-types/CardType";
import type { PlayerType } from "@cross-cribbs/shared-types/PlayerType";
import { useState } from "react";

type ChildProps = {
  pos: BoardPosition;
  card: CardType | null;
  turn: number;
  cardSizes: CardSizesType;
  playCard: (pos: BoardPosition) => void;
};

export default function Spot({ pos, card, playCard, turn, cardSizes }: ChildProps) {
  const [isOver, setIsOver] = useState(false);

  function handleDragOver(e: any) {
    e.stopPropagation();
    e.preventDefault();
    setIsOver(true);
  }

  function handleDragLeave(e: any) {
    e.stopPropagation();
    e.preventDefault();
    setIsOver(false);
  }

  function handleDrop(e: any) {
    e.preventDefault();
    const playerData = e.dataTransfer.getData("application/player");
    if (!playerData) return;
    if (playerData) {
      const player: PlayerType = JSON.parse(playerData);
      console.log("Dropped player:", player);
      if (player.num !== turn) {
        return;
      }
    }
    playCard(pos);
  }

  const placeholderImage = "/cards/fronts/clubs_2.svg";
  const hover = "bg-blue-300";

  const cardSpotStyles = `${isOver ? hover : "bg-stone-200"} ${cardSizes.base} ${cardSizes.md} ${cardSizes.xl}  border-2 border-stone-700 hover:${hover} transition duration-300 cursor-pointer1`;

  if (card) {
    return (
      <td className={cardSpotStyles} onDragStart={(e) => (e.dataTransfer.effectAllowed = "move")}>
        <img className="h-full" src={card.frontImgSrc} alt="" draggable="false" />
      </td>
    );
  }
  // Show placeholder if no card played
  return (
    <td
      className={cardSpotStyles}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => playCard(pos)}
    >
      <img className="h-full invisible" src={placeholderImage} alt="" draggable="false" />
    </td>
  );
}
