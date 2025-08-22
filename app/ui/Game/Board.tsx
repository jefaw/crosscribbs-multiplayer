/*
- Board component:
  - Renders a 5x5 grid of spots
  - Each spot can accept a card
*/

type ChildProps = {
  board: number[][];
  selectedCard: string;
  playCard: string;
};

import Spot from "./Spot";

export default function Board({ board, selectedCard, playCard }: ChildProps) {
  let displayBoard = [];
  // Render board
  for (let r = 0; r < 5; r++) {
    let row = [];
    for (let c = 0; c < 5; c++) {
      // Pushing spot into row
      row.push(
        <Spot pos={[r, c]} card={board[r][c]} key={`${r}, ${c}`} selectedCard={selectedCard} playCard={playCard} />
      );
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
