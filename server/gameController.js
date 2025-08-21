/*
- State management for:
  - deck: The shuffled deck of cards
  - board: 5x5 grid of card placements
  - hand1/hand2: Players' cards
  - turn: Current player's turn
  - selectedCard: Currently selected card
  - scores: Both round and total scores
*/

import { newBoard, newDeck, tallyScores } from "./classes/Helpers.js";

class GameController {
  constructor(numPlayers = 2) {
    this.numPlayers = numPlayers;
    this.deck = null;
    this.board = newBoard();
    this.hand1 = [];
    this.hand2 = [];
    this.turn = 1;
    this.selectedCard = null;
    this.roundScoreVisible = false;
    this.numSpotsLeft = 24;
    this.roundScores = [];
    this.totalScores = [0, 0];
    this.roundOver = false;
    this.gameOver = false;
    this.winner = null;
    this.roundHistory = [];
    this.currentRound = 1;
    
    // Initialize the game
    this.initializeGame();
  }

  // Initialize the game
  initializeGame() {
    this.deck = newDeck();
    
    // Set center card
    this.board[2][2] = this.deck[0];
    
    // Set player hands
    this.hand1 = this.deck.slice(1, 13);
    this.hand2 = this.deck.slice(13, 25);
    
    // Set initial selected card
    this.selectedCard = this.hand1[this.hand1.length - 1];
  }

  // Select a card for a player
  selectCard(player, card) {
    if (player !== this.turn) return false;
    this.selectedCard = card;
    return true;
  }

  // Play a card at a specific position
  playCard(pos) {
    if (!this.selectedCard) return false;
    
    const [r, c] = pos;
    
    // Display new card on the board FIRST
    this.board[r][c] = this.selectedCard;
    
    // Remove card from player's hand AFTER placing it
    if (this.turn === 1) {
      this.hand1 = this.hand1.slice(0, -1);
    } else if (this.turn === 2) {
      this.hand2 = this.hand2.slice(0, -1);
    }
    
    // Clear selected card AFTER placing it
    this.selectedCard = null;
    
    // Update spots left
    this.numSpotsLeft--;
    
  // Check if round is over (only when no spots remain)
  if (this.numSpotsLeft <= 0) {
      this.roundOver = true;
      this.handleRoundEnd();
    }
    
    // Switch turns
    this.turn = this.turn >= this.numPlayers ? 1 : this.turn + 1;
    
    // Set selected card for next player
    this.updateSelectedCard();
    
    return true;
  }

  // Update selected card based on current turn
  updateSelectedCard() {
    let hand;
    if (this.turn === 1) {
      hand = this.hand1;
    } else if (this.turn === 2) {
      hand = this.hand2;
    }
    
    this.selectedCard = hand.length > 0 ? hand[hand.length - 1] : null;
  }

  // Handle round end
  handleRoundEnd() {
    this.roundScoreVisible = true;
    
    // Update round score
    this.roundScores = tallyScores(this.board);
    
    // Calculate round points
    const [rowRoundScore, columnRoundScore] = this.roundScores;
    const rowPoints = rowRoundScore.total();
    const columnPoints = columnRoundScore.total();
    const pointDiff = Math.abs(rowPoints - columnPoints);
    const roundWinner = rowPoints >= columnPoints ? "Row" : "Column";

    // Add round to history
    this.roundHistory.push({
      round: this.currentRound,
      rowScore: rowPoints,
      columnScore: columnPoints,
      pointDiff,
      winner: roundWinner
    });

    // Update total score
    if (rowPoints >= columnPoints) {
      this.totalScores[0] += pointDiff;
    } else {
      this.totalScores[1] += pointDiff;
    }

    // Check for game over condition (31 points)
    if (this.totalScores[0] >= 31) {
      this.gameOver = true;
      this.winner = "Row";
    } else if (this.totalScores[1] >= 31) {
      this.gameOver = true;
      this.winner = "Column";
    }
  }

  // Start next round
  nextRound() {
    if (this.gameOver) return false;
    
    this.board = newBoard();
    this.roundScoreVisible = false;
    this.numSpotsLeft = 24;
    this.roundOver = false;
    this.deck = newDeck();
    this.currentRound++;
    
    // Reinitialize the game
    this.initializeGame();
    
    return true;
  }

  // Reset the entire game
  resetGame() {
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
    
    // Reinitialize the game
    this.initializeGame();
  }

  // Get current game state
  getGameState() {
    return {
      board: this.board,
      turn: this.turn,
      hand1: this.hand1,
      hand2: this.hand2,
      selectedCard: this.selectedCard,
      roundScoreVisible: this.roundScoreVisible,
      roundScores: this.roundScores,
      totalScores: this.totalScores,
      gameOver: this.gameOver,
      winner: this.winner,
      roundHistory: this.roundHistory,
      currentRound: this.currentRound,
      numSpotsLeft: this.numSpotsLeft
    };
  }

  // Check if a move is valid
  isValidMove(pos) {
    const [r, c] = pos;
    return r >= 0 && r < 5 && c >= 0 && c < 5 && this.board[r][c] === null;
  }

  // Get available moves for current player
  getAvailableMoves() {
    const moves = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (this.board[i][j] === null) {
          moves.push([i, j]);
        }
      }
    }
    return moves;
  }
}

export default GameController;
