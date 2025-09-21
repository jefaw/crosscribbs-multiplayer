import type { CardType } from "./CardType.js";

export interface DeckType {
  deck: CardType[];
  createDeck(): void;
  getCard(): CardType | undefined; // pop() might return undefined
  getHand(): (CardType | undefined)[];
  shuffleDeck(originalArray: CardType[]): CardType[];
}
