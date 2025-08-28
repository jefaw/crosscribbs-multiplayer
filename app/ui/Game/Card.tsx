import React from 'react';
import type { CardType } from "@shared/types/CardType";

interface CardProps {
  card: CardType;
  isFaceUp?: boolean; // Optional prop to control if the card is face up or down
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLImageElement>) => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, isFaceUp = true, draggable, onDragStart, className }) => {
  const imgSrc = isFaceUp ? card.frontImgSrc : `cards/backs/red2.svg`; // Default back image

  return (
    <img
      className={`w-24 h-36 rounded-lg shadow-md ${className}`}
      src={imgSrc}
      alt={isFaceUp ? `${card.name} of ${card.suit}` : "Card back"}
      draggable={draggable}
      onDragStart={onDragStart}
    />
  );
};

export default Card;
