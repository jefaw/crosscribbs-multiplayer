import { CARD_NAME, CARD_VAL, SUITS } from "../types/CardType";
import type { CardType, CardName, CardValue, Suit } from "../types/CardType";

export default class Card implements CardType {
  id: number;
  nameIdx: number;
  name: CardName;
  value: CardValue;
  suit: Suit;
  frontImgSrc: string;

  constructor(nameIdx: number, suitIdx: number, id: number) {
    this.nameIdx = nameIdx;
    this.name = CARD_NAME[nameIdx];
    this.value = CARD_VAL[nameIdx];
    this.suit = SUITS[suitIdx];
    this.frontImgSrc = `/cards/fronts/${this.suit}_${this.name}.svg`;
    this.id = id;
  }
}
