/*
- Deck class handles:
  - Creating a full 52-card deck
  - Shuffling cards
  - Dealing cards to players
*/

import Card from "./Card.js";
export default class Deck {
  deck = [];
  constructor() {
    this.createDeck();
    this.deck = this.shuffleDeck(this.deck);
  }
  createDeck() {
    let deckIdx = 0;
    for (let suitIdx = 0; suitIdx < 4; suitIdx++) {
      for (let nameIdx = 0; nameIdx < 13; nameIdx++) {
        this.deck[deckIdx++] = new Card(nameIdx, suitIdx);
      }
    }
  }
  getCard() {
    //Randomly gets one card
    const card = this.deck.pop();
    return card;
  }

  getHand() {
    const hand = [];
    for (let i = 0; i < 14; i++) {
      hand[i] = this.getCard();
    }
    return hand;
  }

  //Fishman-yeetes shuffle deck alg
  shuffleDeck(originalArray) {
    const newArray = [...originalArray]; // Create a copy to avoid modifying the original array

    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
  }
}
