import type { BoardType, GameStateType, RoundHistoryType } from "@shared/types/GameControllerTypes.js";
import { newBoard, newDeck, tallyScores } from "./classes/Helpers.js";
import type { CardType } from "@shared/types/CardType.js";
import type { ScoreType } from "@shared/types/ScoreType.js";
// import type { CardType, GameStateType, RoundHistoryType, BoardType } from "@shared/types/GameControllerTypes";

export default class GameController {
  numPlayers: number;
  deck: CardType[] | null;
  board: BoardType;
  hand1: CardType[];
  hand2: CardType[];
  hand3: CardType[];
  hand4: CardType[];
  turn: number;
  selectedCard: CardType | null;
  roundScoreVisible: boolean;
  numSpotsLeft: number;
  roundScores: ScoreType[] | null; // refine based on tallyScores return type
  totalScores: [number, number];
  roundOver: boolean;
  gameOver: boolean;
  winner: "Row" | "Column" | null;
  roundHistory: RoundHistoryType[];
  currentRound: number;

  constructor(numPlayers = 2) {
    this.numPlayers = numPlayers;
    this.deck = null;
    this.board = newBoard();
    this.hand1 = [];
    this.hand2 = [];
    this.hand3 = [];
    this.hand4 = [];
    this.turn = 1;
    this.selectedCard = null;
    this.roundScoreVisible = false;
    this.numSpotsLeft = 24;
    this.roundScores = null;
    this.totalScores = [0, 0];
    this.roundOver = false;
    this.gameOver = false;
    this.winner = null;
    this.roundHistory = [];
    this.currentRound = 1;

    // Initialize the game
    this.initializeGame();
  }

  initializeGame(): void {
    this.deck = newDeck();
    this.board[2][2] = this.deck[0];
    if (this.numPlayers === 2) {
      this.hand1 = this.deck?.slice(1, 13) || [];
      this.hand2 = this.deck?.slice(13, 25) || [];
    } else {
      this.hand1 = this.deck?.slice(1, 7) || [];
      this.hand2 = this.deck?.slice(7, 13) || [];
      this.hand3 = this.deck?.slice(13, 19) || [];
      this.hand4 = this.deck?.slice(19, 25) || [];
    }
    this.selectedCard = this.hand1[this.hand1.length - 1];
  }

  selectCard(player: number, card: CardType): boolean {
    if (player !== this.turn) return false;
    this.selectedCard = card;
    return true;
  }

  playCard(pos: [number, number]): boolean {
    if (!this.selectedCard) return false;
    const [r, c] = pos;
    this.board[r][c] = this.selectedCard;

    if (this.turn === 1) {
      this.hand1.pop();
    } else if (this.turn === 2) {
      this.hand2.pop();
    } else if (this.turn === 3) {
      this.hand3.pop();
    } else if (this.turn === 4) {
      this.hand4.pop();
    }

    this.selectedCard = null;
    this.numSpotsLeft--;

    if (this.numSpotsLeft <= 0) {
      this.roundOver = true;
      this.handleRoundEnd();
    }

    this.turn = this.turn >= this.numPlayers ? 1 : this.turn + 1;
    this.updateSelectedCard();

    return true;
  }

  updateSelectedCard(): void {
    let hand: CardType[];
    if (this.turn === 1) hand = this.hand1;
    else if (this.turn === 2) hand = this.hand2;
    else if (this.turn === 3) hand = this.hand3;
    else if (this.turn === 4) hand = this.hand4;
    else hand = [];

    this.selectedCard = hand.length > 0 ? hand[hand.length - 1] : null;
  }

  handleRoundEnd(): void {
    this.roundScoreVisible = true;
    this.roundScores = tallyScores(this.board);
    const [rowRoundScore, columnRoundScore] = this.roundScores;
    const rowPoints = rowRoundScore.total;
    const columnPoints = columnRoundScore.total;
    const pointDiff = Math.abs(rowPoints - columnPoints);
    const roundWinner: "Row" | "Column" = rowPoints >= columnPoints ? "Row" : "Column";

    this.roundHistory.push({
      round: this.currentRound,
      rowScore: rowPoints,
      columnScore: columnPoints,
      pointDiff,
      winner: roundWinner,
    });

    if (rowPoints >= columnPoints) this.totalScores[0] += pointDiff;
    else this.totalScores[1] += pointDiff;

    if (this.totalScores[0] >= 31) {
      this.gameOver = true;
      this.winner = "Row";
    } else if (this.totalScores[1] >= 31) {
      this.gameOver = true;
      this.winner = "Column";
    }
  }

  nextRound(): boolean {
    if (this.gameOver) return false;
    this.board = newBoard();
    this.roundScoreVisible = false;
    this.numSpotsLeft = 24;
    this.roundOver = false;
    this.deck = newDeck();
    this.currentRound++;
    this.initializeGame();
    return true;
  }

  resetGame(): void {
    this.board = newBoard();
    this.roundScoreVisible = false;
    this.numSpotsLeft = 24;
    this.roundOver = false;
    this.gameOver = false;
    this.winner = null;
    this.totalScores = [0, 0];
    this.deck = newDeck();
    this.roundHistory = [];
    this.currentRound = 1;
    this.initializeGame();
  }

  getGameState(): GameStateType {
    return {
      board: this.board,
      turn: this.turn,
      hand1: this.hand1,
      hand2: this.hand2,
      hand3: this.hand3,
      hand4: this.hand4,
      numPlayers: this.numPlayers,
      selectedCard: this.selectedCard,
      roundScoreVisible: this.roundScoreVisible,
      roundScores: this.roundScores,
      totalScores: this.totalScores,
      gameOver: this.gameOver,
      winner: this.winner,
      roundHistory: this.roundHistory,
      currentRound: this.currentRound,
      numSpotsLeft: this.numSpotsLeft,
    };
  }

  isValidMove(pos: [number, number]): boolean {
    const [r, c] = pos;
    return r >= 0 && r < 5 && c >= 0 && c < 5 && this.board[r][c] === null;
  }

  getAvailableMoves(): [number, number][] {
    const moves: [number, number][] = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (this.board[i][j] === null) moves.push([i, j]);
      }
    }
    return moves;
  }
}
