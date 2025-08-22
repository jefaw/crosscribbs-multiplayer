/*
- Card class represents each card with:
  - name (ace through king)
  - value (1-13)
  - suit (spades, clubs, hearts, diamonds)
  - image source for display
*/

const CARD_NAME = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
const CARD_VAL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const SUITS = ["spades", "clubs", "hearts", "diamonds"];

export default class Card {
  constructor(nameIdx, suitIdx, id) {
    this.nameIdx = nameIdx;
    this.name = CARD_NAME[nameIdx];
    this.value = CARD_VAL[nameIdx]
    this.suit = SUITS[suitIdx];
    this.frontImgSrc = `/cards/fronts/${this.suit}_${this.name}.svg`;
    this.id = id;
  }
}
