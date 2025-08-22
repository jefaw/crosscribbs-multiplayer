import Card from "@shared/classes/Card";
import Score from "./Score";
import type { CardType, CardValue } from "@shared/types/CardType";
import type { BoardType } from "@shared/types/GameControllerTypes";

function newBoard() {
  let board: BoardType = [];
  for (let r = 0; r < 5; r++) {
    let row = [];
    for (let c = 0; c < 5; c++) {
      row.push(null);
    }
    board.push(row);
  }
  return board;
}

//Fishman-yeetes shuffle deck alg
function shuffleDeck(originalArray: CardType[]) {
  const newArray = [...originalArray]; // Create a copy to avoid modifying the original array

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

function newDeck() {
  let deck = [];
  let deckIdx = 0;
  let cardId = 0;
  for (let suitIdx = 0; suitIdx < 4; suitIdx++) {
    for (let nameIdx = 0; nameIdx < 13; nameIdx++) {
      deck[deckIdx++] = new Card(nameIdx, suitIdx, cardId);
      cardId++;
    }
  }
  return shuffleDeck(deck);
}

export { newBoard, newDeck, tallyScores };

//Scoring
function tallyScores(board: BoardType) {
  const rowScore = calculateScore(board);
  const colScore = calculateScore(transpose(board));

  return [rowScore, colScore];
}

//returns a score object
function calculateScore(board: BoardType) {
  let score = 0;
  let pairTotal = 0;
  let runTotal = 0;
  let fifteenTotal = 0;
  // Assuming grid is a 2D array
  for (const row of board) {
    let rowScore = 0;
    let pairScore = 0;
    let runScore = 0;
    let fifteenScore = 0;

    console.log(row);

    // Count occurrences of elements in the row
    const m: Record<number, number> = {};
    for (let i = 0; i < row.length; i++) {
      const n = row[i]?.value;
      if (!n) continue;
      m[n] = (m[n] || 0) + 1;
    }
    // console.log(`ROW COUNTS: ${JSON.stringify(m)}`);

    // Calculate 15 sum score
    const fifteen_combos = calculateFifteen(row, 15);
    // console.log(`Fifteen combos ${JSON.stringify(fifteen_combos)}`);
    fifteenScore = fifteen_combos.length * 2;

    // Iterate through the occurrences
    for (const [key, value] of Object.entries(m)) {
      const numKey = Number(key); // cast string to number
      // Calculate pairs score
      if (value > 1) {
        if (value === 2) pairScore += 2;
        else if (value === 3) pairScore += 6;
        else if (value === 4) pairScore += 12;
      }

      // Calculate runs score
      let maxrun = 1;
      let multiplier = value;

      if (!(numKey - 1 in m)) {
        let run = 1;

        while (parseInt(key) + run in m) {
          multiplier = Math.max(multiplier, m[parseInt(key) + run]);
          run += 1;
        }
        maxrun = Math.max(run, maxrun);

        // Reset run
        if (run < 3) multiplier = 1;
        run = 1;
      }

      if (maxrun >= 3) {
        if (maxrun === 5) runScore += 5;
        else if (maxrun === 4) runScore += 4 * multiplier;
        else runScore += 3 * multiplier;
      }
    }

    pairTotal += pairScore;
    runTotal += runScore;
    fifteenTotal += fifteenScore;
    rowScore = pairScore + runScore + fifteenScore;
    score += rowScore;
    console.log(
      `Score for row: (Pairs: ${pairScore}) + (Runs: ${runScore}) + (Fifteens: ${fifteenScore}) = ${rowScore}`
    );

    rowScore = 0;

    console.log(`Running total: ${score}`);
    console.log("-------------------------------------------------------");
    // Can display row scores as sum of scores for pairs, runs, etc. For viewability
    // Can keep total scores for pairs and runs as well
  }

  const scoreTotals = new Score(pairTotal, runTotal, fifteenTotal);
  return scoreTotals;
}

function calculateFifteen(array: (CardType | null)[], targetSum = 15) {
  let result: CardValue[][] = [];

  function subsetSumsHelper(currentSum: number, startIndex: number, path: CardValue[]) {
    if (currentSum === targetSum) {
      // console.log("15 Combination found:", path);
      result.push([...path]);
      return;
    }

    for (let i = startIndex; i < array.length; i++) {
      if (!array[i]) return;
      if (currentSum + Math.min(array[i]!.value, 10) <= targetSum) {
        // Faces count as 10
        subsetSumsHelper(currentSum + Math.min(array[i]!.value, 10), i + 1, [...path, array[i]!.value]);
      }
    }
  }
  subsetSumsHelper(0, 0, []);
  return result;
}

function transpose(board: BoardType) {
  //turn rows into col
  const boardTransposed = board[0].map((_, colIndex) => board.map((row) => row[colIndex]));

  return boardTransposed;
}
