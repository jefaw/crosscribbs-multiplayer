import type { CardType } from "./CardType";

export interface PlayerType {
  id: number; // socket id of player
  name: String; // player username
  hand: CardType[];
  score: number;
}
