import type { CardType } from "./CardType.js";
import type { PlayerType } from "./PlayerType.js";
import type { ScoreType } from "./ScoreType.js";

export interface LobbyPlayerType {
  id: string;
  name: string;
}

export interface LobbyType {
  players: LobbyPlayerType[];
  host: string;
  numPlayers: number;
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
  lobby: LobbyType | null;
  board: BoardType;
  turn: number;
  turnIndex: number;
  players: PlayerType[];
  numPlayers: number;
  selectedCard: CardType | null;
  roundScoreVisible: boolean;
  roundScores: ScoreType[] | null; // You can refine if you know exact score types
  totalScores: [number, number];
  gameOver: boolean;
  winner: "Row" | "Column" | null;
  roundHistory: RoundHistoryType[];
  currentRound: number;
  numSpotsLeft: number;
  dealer: number | null;
  crib: CardType[];
  dealerSelectionCards: CardType[] | null;
  dealerSelectionComplete: boolean;
  cribScore: ScoreType | null;
  heels: number; // 0 or 2
  // added ai fields maybe should use instead

  // players: PlayerType[];
  // deck: CardType[]; // remaining deck
  // discardPile: CardType[]; // cards that have been played
  // currentTurn: number; // index of the player whose turn it is
  // maxHandSize: number; // optional, e.g., 14
  // winnerId?: string; // optional, if game ended
}
