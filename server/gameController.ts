import type { BoardType, GameStateType, RoundHistoryType } from "@shared/types/GameControllerTypes";
import { newBoard, newDeck, tallyScores } from "./classes/Helpers";
import Player from "./classes/Player";
import type { CardType } from "@shared/types/CardType";
import type { ScoreType } from "@shared/types/ScoreType";
import type { PlayerType } from "@shared/types/PlayerType";
// import type { CardType, GameStateType, RoundHistoryType, BoardType } from "@shared/types/GameControllerTypes";

export default class GameController implements GameStateType {
  numPlayers: number;
  deck: CardType[] | null;
  board: BoardType;
  player1: PlayerType;
  player2: PlayerType;
  player3: PlayerType;
  player4: PlayerType;
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
  dealer: number | null;
  crib: CardType[];
  dealerSelectionCards: CardType[] | null;
  dealerSelectionComplete: boolean;
  cribScore: ScoreType | null;
  heels: number; // if his heels was scored this round

  constructor(numPlayers = 2) {
    this.numPlayers = numPlayers;
    this.deck = null;
    this.board = newBoard();
    this.player1 = new Player("", 1, "", [], []);
    this.player2 = new Player("", 2, "", [], []);
    this.player3 = new Player("", 3, "", [], []);
    this.player4 = new Player("", 4, "", [], []);
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
    this.dealer = null;
    this.crib = [];
    this.dealerSelectionCards = null;
    this.dealerSelectionComplete = false;
    this.cribScore = null;
    this.heels = 0;

    // Initialize the game
    this.startDealerSelection();
  }

  getPlayer(playerNumber: number): PlayerType {
    switch (playerNumber) {
      case 1:
        return this.player1;
      case 2:
        return this.player2;
      case 3:
        return this.player3;
      case 4:
        return this.player4;
      default:
        throw new Error("Invalid player number");
    }
  }

  getPlayers() {
    if (this.numPlayers === 2) {
      return [this.player1, this.player2];
    } else if (this.numPlayers === 4) {
      return [this.player1, this.player2, this.player3, this.player4];
    } else {
      throw new Error("Invalid num players");
    }
  }

  startDealerSelection(): void {
    this.deck = newDeck();
    this.dealerSelectionCards = this.deck.slice(0, this.numPlayers);
  }

  selectDealer(winningPlayer: number): void {
    this.dealer = winningPlayer;
    this.dealerSelectionComplete = true;
    this.initializeGame();
  }

  initializeGame(): void {
    this.deck = newDeck();
    this.board[2][2] = this.deck[0];

    // His Heels for center jack which gives 2 points to dealer at the end of the round
    if (this.deck[0].name === "jack") {
      this.heels = 2;
    }
    else{
      this.heels = 0;
    }

    if (this.numPlayers === 2) {
      this.player1.hand = this.deck?.slice(1, 15) || []; // 14 cards
      this.player2.hand = this.deck?.slice(15, 29) || []; // 14 cards
    } else {
      this.player1.hand = this.deck?.slice(1, 8) || []; // 7 cards
      this.player2.hand = this.deck?.slice(8, 15) || []; // 7 cards
      this.player3.hand = this.deck?.slice(15, 22) || []; // 7 cards
      this.player4.hand = this.deck?.slice(22, 29) || []; // 7 cards
    }

    this.player1.discardedToCrib = [];
    this.player2.discardedToCrib = [];
    this.player3.discardedToCrib = [];
    this.player4.discardedToCrib = [];

    this.selectedCard = this.player1.hand[this.player1.hand.length - 1];
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
      this.player1.hand.pop();
    } else if (this.turn === 2) {
      this.player2.hand.pop();
    } else if (this.turn === 3) {
      this.player3.hand.pop();
    } else if (this.turn === 4) {
      this.player4.hand.pop();
    }

    this.selectedCard = null;
    this.numSpotsLeft--;

    this.nextTurn();
    return true;
  }

  discardToCrib(numPlayers: number, player: PlayerType, card: CardType): boolean {
    if (player.num !== this.turn) return false;

    if (numPlayers === 2 && player.discardedToCrib.length >= 2) {
      return false;
    }
    if (numPlayers === 4 && player.discardedToCrib.length >= 1) {
      return false;
    }

    // discard card to crib
    this.crib.push(card);
    if (player.num === 1) {
      this.player1.discardedToCrib.push(card);
    } else if (player.num === 2) {
      this.player2.discardedToCrib.push(card);
    } else if (player.num === 3) {
      this.player3.discardedToCrib.push(card);
    } else if (player.num === 4) {
      this.player4.discardedToCrib.push(card);
    }

    // remove card from Players hand
    let hand: CardType[];
    if (this.turn === 1) hand = this.player1.hand;
    else if (this.turn === 2) hand = this.player2.hand;
    else if (this.turn === 3) hand = this.player3.hand;
    else if (this.turn === 4) hand = this.player4.hand;
    else hand = [];

    const cardIndex = hand.findIndex((c) => c.suit === card.suit && c.value === card.value);
    if (cardIndex > -1) {
      hand.splice(cardIndex, 1);
    } else {
      return false; // card not in hand
    }

    // Change turns if last card
    if (!hand.length) this.nextTurn();

    return true;
  }

  forcedToDiscardToCrib(player: PlayerType): boolean {
    let numPlayerMustDiscardToCrib: number;
    if (this.numPlayers === 2) {
      numPlayerMustDiscardToCrib = 2;
    } else {
      numPlayerMustDiscardToCrib = 1;
    }

    // player foced to discard to crib
    if (player.discardedToCrib.length < numPlayerMustDiscardToCrib) {
      return true;
    }

    return false;
  }

  isRoundOver() {
    for (const player of this.getPlayers()) {
      if (player.hand.length !== 0) {
        return false;
      } else if (this.forcedToDiscardToCrib(player)) {
        return false;
      }
    }
    return true;
  }

  nextTurn() {
    if (this.isRoundOver()) {
      this.roundOver = true;
      this.handleRoundEnd();
      return;
    }
    this.turn = this.turn >= this.numPlayers ? 1 : this.turn + 1;
    const player = this.getPlayer(this.turn);
    if (!player.hand.length && !this.forcedToDiscardToCrib(player)) {
      this.nextTurn(); // if hand is empty then switch to next turn
    }
    this.updateSelectedCard();
  }

  updateSelectedCard(): void {
    let hand: CardType[];
    if (this.turn === 1) hand = this.player1.hand;
    else if (this.turn === 2) hand = this.player2.hand;
    else if (this.turn === 3) hand = this.player3.hand;
    else if (this.turn === 4) hand = this.player4.hand;
    else hand = [];

    this.selectedCard = hand.length > 0 ? hand[hand.length - 1] : null;
  }

  handleRoundEnd(): void {
    this.roundScoreVisible = true;

    // Score the crib
    const cutCard = this.board[2][2];
    let cribKnobsScore = 0;
    if (cutCard) {
      const cribHand: CardType[] = [...this.crib, cutCard];

      for (const card of this.crib) {
        if (card.name === "jack" && card.suit === cutCard.suit) {
          cribKnobsScore = 1;
          break;
        }
      }

      // There is no helper function to score a single hand, so I will mock a board
      const cribBoard: BoardType = [cribHand, [], [], [], []];
      this.cribScore = tallyScores(cribBoard)[0]; // only care about the row score
    }
    // Score the total using round scores
    this.roundScores = tallyScores(this.board, cutCard);
    const [rowRoundScore, columnRoundScore] = this.roundScores;

    if (this.dealer === 1 || this.dealer === 3) {
      rowRoundScore.total += this.cribScore?.total || 0;
      rowRoundScore.total += cribKnobsScore;
      rowRoundScore.total += this.heels;
    } else {
      columnRoundScore.total += this.cribScore?.total || 0;
      columnRoundScore.total += cribKnobsScore;
      columnRoundScore.total += this.heels;
    }

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
    this.crib = [];
    if (this.dealer) {
      this.dealer = this.dealer >= this.numPlayers ? 1 : this.dealer + 1;
    }
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
      player1: this.player1,
      player2: this.player2,
      player3: this.player3,
      player4: this.player4,
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
      dealer: this.dealer,
      crib: this.crib,
      dealerSelectionCards: this.dealerSelectionCards,
      dealerSelectionComplete: this.dealerSelectionComplete,
      cribScore: this.cribScore,
      heels: this.heels,
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
