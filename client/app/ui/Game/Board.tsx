/*
- Board component:
  - Renders a 5x5 grid of spots
  - Each spot can accept a card
*/

import Spot from "./Spot";
import type { CardType } from "@cross-cribbs/shared-types/CardType";
import type { BoardPosition } from "@cross-cribbs/shared-types/BoardTypes";
import type { BoardType } from "@cross-cribbs/shared-types/GameControllerTypes";

type ChildProps = {
  board: BoardType;
  selectedCard: CardType | null;
  playCard: (pos: BoardPosition) => void;
};

export default function Board({ board, selectedCard, playCard }: ChildProps) {
  let displayBoard = [];
  // Render board
  for (let r = 0; r < 5; r++) {
    let row = [];
    for (let c = 0; c < 5; c++) {
      // Pushing spot into row
      row.push(<Spot pos={[r, c]} card={board[r][c]} key={`${r}, ${c}`} playCard={playCard} />);
    }

    // Pushing row of spots into board
    displayBoard.push(
      <tr className="" key={r}>
        {row}
      </tr>
    );
  }

  return (
    <div>
      <table className="flex justify-center border-separate border-spacing-2">
        <tbody>{displayBoard}</tbody>
      </table>
    </div>
  );
}
