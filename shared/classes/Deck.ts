import Card from "./Card";
import type { CardType } from "../types/CardType";

export default class Deck {
  deck: CardType[] = [];

  constructor() {
    this.createDeck();
    this.deck = this.shuffleDeck(this.deck);
  }

  createDeck(): void {
    let deckIdx = 0;
    for (let suitIdx = 0; suitIdx < 4; suitIdx++) {
      for (let nameIdx = 0; nameIdx < 13; nameIdx++) {
        this.deck[deckIdx++] = new Card(nameIdx, suitIdx, deckIdx);
      }
    }
  }

  getCard(): CardType | undefined {
    //
    return this.deck.pop();
  }

  getHand(): (CardType | undefined)[] {
    const hand: (CardType | undefined)[] = [];
    for (let i = 0; i < 14; i++) {
      hand[i] = this.getCard();
    }
    return hand;
  }

  shuffleDeck(originalArray: CardType[]): CardType[] {
    const newArray = [...originalArray]; // copy array

    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
  }
}
