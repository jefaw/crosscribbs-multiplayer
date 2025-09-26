// constants
export const CARD_NAME = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"] as const;
export const CARD_VAL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
export const SUITS = ["spades", "clubs", "hearts", "diamonds"] as const;

// types
export type CardName = (typeof CARD_NAME)[number];
export type CardValue = (typeof CARD_VAL)[number];
export type Suit = (typeof SUITS)[number];

export interface CardType {
  id: number;
  nameIdx: number;
  name: CardName;
  value: CardValue;
  suit: Suit;
  frontImgSrc: string;
}

export interface CardSizesType {
  base: string;
  md: string;
  xl: string;
  maxBase: string;
}
