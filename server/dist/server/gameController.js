import { newBoard, newDeck, tallyScores } from "./classes/Helpers.js";
import Player from "./classes/Player.js";
// import type { CardType, GameStateType, RoundHistoryType, BoardType } from "@shared/types/GameControllerTypes";
export default class GameController {
    lobby;
    numPlayers;
    deck;
    board;
    player1;
    player2;
    player3;
    player4;
    turn;
    turnIndex;
    selectedCard;
    roundScoreVisible;
    numSpotsLeft;
    roundScores; // refine based on tallyScores return type
    totalScores;
    roundOver;
    gameOver;
    winner;
    roundHistory;
    currentRound;
    dealer;
    crib;
    dealerSelectionCards;
    dealerSelectionComplete;
    cribScore;
    heels; // if his heels was scored this round
    constructor(numPlayers = 2, lobby = null) {
        this.lobby = lobby;
        this.numPlayers = numPlayers;
        this.deck = null;
        this.board = newBoard();
        this.player1 = new Player("", 1, "", [], []);
        this.player2 = new Player("", 2, "", [], []);
        this.player3 = new Player("", 3, "", [], []);
        this.player4 = new Player("", 4, "", [], []);
        this.turn = 1;
        this.turnIndex = 0;
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
        this.dealer = 1;
        this.crib = [];
        this.dealerSelectionCards = null;
        this.dealerSelectionComplete = false;
        this.cribScore = null;
        this.heels = 0;
        // if multiplayer, assign socket IDs
        if (lobby) {
            const players = lobby.players;
            if (players[0])
                this.player1.id = players[0].id;
            if (players[1])
                this.player2.id = players[1].id;
            if (players[2])
                this.player3.id = players[2].id;
            if (players[3])
                this.player4.id = players[3].id;
            this.numPlayers = lobby.numPlayers; // set multiplayer numPlayers
        }
        // Initialize the game
        // this.startDealerSelection();
        this.initializeGame();
    }
    get currentPlayerId() {
        if (!this.lobby)
            return; // local game no socket check
        return this.lobby.players[this.turnIndex].id;
    }
    getPlayer(playerNumber) {
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
        }
        else if (this.numPlayers === 4) {
            return [this.player1, this.player2, this.player3, this.player4];
        }
        else {
            throw new Error("Invalid num players");
        }
    }
    applyMove(move, playerId) {
        const valid = this.isValidMove(move);
        if (valid && this.playCard(move, playerId)) {
            return true;
        }
        else {
            return false;
        }
    }
    startDealerSelection() {
        this.deck = newDeck();
        this.dealerSelectionCards = this.deck.slice(0, this.numPlayers);
    }
    selectDealer(winningPlayer) {
        this.dealer = winningPlayer;
        this.dealerSelectionComplete = true;
        this.initializeGame();
    }
    initializeGame() {
        this.deck = newDeck();
        this.board[2][2] = this.deck[0];
        // His Heels for center jack which gives 2 points to dealer at the end of the round
        if (this.deck[0].name === "jack") {
            this.heels = 2;
        }
        else {
            this.heels = 0;
        }
        if (this.numPlayers === 2) {
            this.player1.hand = this.deck?.slice(1, 15) || []; // 14 cards
            this.player2.hand = this.deck?.slice(15, 29) || []; // 14 cards
        }
        else {
            this.player1.hand = this.deck?.slice(1, 8) || []; // 7 cards
            this.player2.hand = this.deck?.slice(8, 15) || []; // 7 cards
            this.player3.hand = this.deck?.slice(15, 22) || []; // 7 cards
            this.player4.hand = this.deck?.slice(22, 29) || []; // 7 cards
        }
        this.crib = [];
        this.player1.discardedToCrib = [];
        this.player2.discardedToCrib = [];
        this.player3.discardedToCrib = [];
        this.player4.discardedToCrib = [];
        this.selectedCard = this.player1.hand[this.player1.hand.length - 1];
    }
    selectCard(playerId, card) {
        if (playerId !== this.currentPlayerId)
            return false;
        this.selectedCard = card;
        return true;
    }
    playCard(pos, playerId) {
        if (!this.selectedCard)
            return false;
        if (this.lobby && playerId !== this.currentPlayerId)
            return false; // if multi ensure matching playerId for correct turn id
        const [r, c] = pos;
        this.board[r][c] = this.selectedCard;
        const player = this.getPlayer(this.turn);
        player.hand.pop();
        this.selectedCard = null;
        this.numSpotsLeft--;
        this.nextTurn();
        return true;
    }
    discardToCrib(numPlayers, player, card, playerId) {
        if (player.num !== this.turn)
            return false;
        if (this.lobby && playerId !== this.currentPlayerId)
            return false; // if multi ensure matching playerId for correct turn id
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
        }
        else if (player.num === 2) {
            this.player2.discardedToCrib.push(card);
        }
        else if (player.num === 3) {
            this.player3.discardedToCrib.push(card);
        }
        else if (player.num === 4) {
            this.player4.discardedToCrib.push(card);
        }
        // remove card from Players hand
        let hand;
        if (this.turn === 1)
            hand = this.player1.hand;
        else if (this.turn === 2)
            hand = this.player2.hand;
        else if (this.turn === 3)
            hand = this.player3.hand;
        else if (this.turn === 4)
            hand = this.player4.hand;
        else
            hand = [];
        const cardIndex = hand.findIndex((c) => c.suit === card.suit && c.value === card.value);
        if (cardIndex > -1) {
            hand.splice(cardIndex, 1);
        }
        else {
            return false; // card not in hand
        }
        // Change turns if last card
        if (!hand.length)
            this.nextTurn();
        return true;
    }
    forcedToDiscardToCrib(player) {
        let numPlayerMustDiscardToCrib;
        if (this.numPlayers === 2) {
            numPlayerMustDiscardToCrib = 2;
        }
        else {
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
            }
            else if (this.forcedToDiscardToCrib(player)) {
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
        this.turnIndex = this.turnIndex >= this.numPlayers - 1 ? 0 : this.turnIndex + 1;
        const player = this.getPlayer(this.turn);
        if (!player.hand.length && !this.forcedToDiscardToCrib(player)) {
            this.nextTurn(); // if hand is empty then switch to next turn
        }
        this.updateSelectedCard();
    }
    updateSelectedCard() {
        let hand;
        if (this.turn === 1)
            hand = this.player1.hand;
        else if (this.turn === 2)
            hand = this.player2.hand;
        else if (this.turn === 3)
            hand = this.player3.hand;
        else if (this.turn === 4)
            hand = this.player4.hand;
        else
            hand = [];
        this.selectedCard = hand.length > 0 ? hand[hand.length - 1] : null;
    }
    handleRoundEnd() {
        this.roundScoreVisible = true;
        // Score the crib
        const cutCard = this.board[2][2];
        if (cutCard) {
            const cribHand = [...this.crib, cutCard];
            // There is no helper function to score a single hand, so I will mock a board
            const cribBoard = [cribHand, [], [], [], []];
            this.cribScore = tallyScores(cribBoard)[0]; // only care about the row score
        }
        // Score the total using round scores
        this.roundScores = tallyScores(this.board, cutCard ?? undefined);
        const [rowRoundScore, columnRoundScore] = this.roundScores;
        if (this.dealer === 1 || this.dealer === 3) {
            rowRoundScore.total += this.cribScore?.total || 0;
            rowRoundScore.total += this.heels;
        }
        else {
            columnRoundScore.total += this.cribScore?.total || 0;
            columnRoundScore.total += this.heels;
        }
        const rowPoints = rowRoundScore.total;
        const columnPoints = columnRoundScore.total;
        const pointDiff = Math.abs(rowPoints - columnPoints);
        const roundWinner = rowPoints >= columnPoints ? "Row" : "Column";
        this.roundHistory.push({
            round: this.currentRound,
            rowScore: rowPoints,
            columnScore: columnPoints,
            pointDiff,
            winner: roundWinner,
        });
        if (rowPoints >= columnPoints)
            this.totalScores[0] += pointDiff;
        else
            this.totalScores[1] += pointDiff;
        if (this.totalScores[0] >= 31) {
            this.gameOver = true;
            this.winner = "Row";
        }
        else if (this.totalScores[1] >= 31) {
            this.gameOver = true;
            this.winner = "Column";
        }
    }
    nextRound() {
        console.log("next round");
        if (this.gameOver)
            return false;
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
        console.log("nr = true");
        return true;
    }
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
        this.dealer = 1;
        this.initializeGame();
    }
    getGameState() {
        return {
            lobby: this.lobby,
            board: this.board,
            turn: this.turn,
            turnIndex: this.turnIndex,
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
    isValidMove(pos) {
        const [r, c] = pos;
        return r >= 0 && r < 5 && c >= 0 && c < 5 && this.board[r][c] === null;
    }
    getAvailableMoves() {
        const moves = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.board[i][j] === null)
                    moves.push([i, j]);
            }
        }
        return moves;
    }
}
