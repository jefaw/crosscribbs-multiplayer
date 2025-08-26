import type { CardType } from "./CardType";

export interface PlayerType {
  id: String; // socket id of player
  num: number;
  name: String; // player username
  hand: CardType[];
  discardedToCrib: CardType[];
}
