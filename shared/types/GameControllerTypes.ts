import type { CardType } from "./CardType";
import type { ScoreType } from "./ScoreType";

// not using currently
export interface PlayerType {
  id: string; // unique player id
  name: string;
  hand: CardType[]; // cards in hand
  score: number;
}

// Optional: define moves/actions
export interface MoveType {
  playerId: string;
  cardId: number;
  // any additional info for move validation
}

export type BoardType = (CardType | null)[][]; // 5x5 grid, null if empty

export interface RoundHistoryType {
  round: number;
  rowScore: number;
  columnScore: number;
  pointDiff: number;
  winner: "Row" | "Column";
}

export interface GameStateType {
  board: BoardType;
  turn: number;
  hand1: CardType[];
  hand2: CardType[];
  selectedCard: CardType | null;
  roundScoreVisible: boolean;
  roundScores: ScoreType[] | null; // You can refine if you know exact score types
  totalScores: [number, number];
  gameOver: boolean;
  winner: "Row" | "Column" | null;
  roundHistory: RoundHistoryType[];
  currentRound: number;
  numSpotsLeft: number;
  // added ai fields maybe should use instead

  // players: PlayerType[];
  // deck: CardType[]; // remaining deck
  // discardPile: CardType[]; // cards that have been played
  // currentTurn: number; // index of the player whose turn it is
  // maxHandSize: number; // optional, e.g., 14
  // winnerId?: string; // optional, if game ended
}
