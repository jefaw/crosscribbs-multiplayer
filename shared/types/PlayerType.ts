import type { CardType } from "./CardType.js";

export interface PlayerType {
  id: string; // socket id of player
  num: number;
  name: string; // player username
  hand: CardType[];
  discardedToCrib: CardType[];
}
