/*
- Board component:
  - Renders a 5x5 grid of spots
  - Each spot can accept a card
*/

import Spot from "./Spot";
import type { CardSizesType, CardType } from "@cross-cribbs/shared-types/CardType";
import type { BoardPosition } from "@cross-cribbs/shared-types/BoardTypes";
import type { BoardType } from "@cross-cribbs/shared-types/GameControllerTypes";

type ChildProps = {
  board: BoardType;
  turn: number;
  playCard: (pos: BoardPosition) => void;
  cardSizes: CardSizesType;
};

export default function Board({ board, playCard, turn, cardSizes }: ChildProps) {
  let displayBoard = [];
  // Render board
  for (let r = 0; r < 5; r++) {
    let row = [];
    for (let c = 0; c < 5; c++) {
      // Pushing spot into row
      row.push(
        <Spot
          pos={[r, c]}
          card={board[r][c]}
          key={`${r}, ${c}`}
          playCard={playCard}
          turn={turn}
          cardSizes={cardSizes}
        />
      );
    }

    // Pushing row of spots into board
    displayBoard.push(
      <tr className="w-full" key={r}>
        {row}
      </tr>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full flex justify-center border-separate border-spacing-[3px]">
        <tbody>{displayBoard}</tbody>
      </table>
    </div>
  );
}
