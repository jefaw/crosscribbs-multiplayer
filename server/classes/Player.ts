import type { CardType } from "@shared/types/CardType.js";
import type { PlayerType } from "@shared/types/PlayerType.js";

export default class Player implements PlayerType {
  id: string;
  num: number;
  name: string;
  hand: CardType[];
  discardedToCrib: CardType[];

  constructor(id: string, num: number, name: string, hand: CardType[], discardedToCrib: CardType[]) {
    this.id = id;
    this.num = num;
    this.name = name;
    this.hand = hand;
    this.discardedToCrib = discardedToCrib;
  }
}
