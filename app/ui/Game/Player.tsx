/*
- Shows player's name
- Displays current top card
- Shows number of cards remaining
- Handles card selection and drag events
*/

import type { CardType } from "@shared/types/CardType";
import type { PlayerType } from "@shared/types/PlayerType";
import { socket } from "~/connections/socket";
import Card from "./Card";

type ChildProps = {
  name: String;
  player: PlayerType;
  turn: number;
  crib: CardType[];
  numPlayers: number;
};

export default function Player({ name, player, turn, crib, numPlayers }: ChildProps) {
  const { hand, discardedToCrib } = player;
  // hand = props.hand

  //Get top card
  const card = hand.length > 0 ? hand[hand.length - 1] : false;

  function handleDragStart(e: any) {
    e.dataTransfer.effectAllowed = "move"; // don't show plus icon on drag
  }

  function handleDiscard() {
    if (card) {
      socket.emit("discardToCrib", { numPlayers, player, card });
    }
  }

  const isActive = player.num === turn;
  const outlineColor = player.num % 2 === 0 ? "outline-cyan-400" : "outline-fuchsia-400";
  const outlineStyle = isActive ? `outline-8 ${outlineColor}` : "outline-2 outline-stone-700";

  const bgGradient =
    player.num === 1
      ? "bg-gradient-to-br from-slate-100 to-slate-200"
      : "bg-gradient-to-br from-slate-100 to-slate-200";

  const displayDiscardButton = numPlayers == 2 ? discardedToCrib.length < 2 : discardedToCrib.length < 1;

  // Only show card if it's the player's turn
  const displayCard =
    isActive && card ? (
      <div className="flex flex-col items-center space-y-1 h-48">
        <Card
          card={card}
          isFaceUp={true}
          draggable={true}
          onDragStart={handleDragStart}
          className="w-24 h-36 self-center hover:border-gray-700 border-transparent border-2 cursor-pointer rounded-lg shadow-lg transition-transform hover:scale-105"
        />
        <p className="text-sm font-medium text-gray-700">Cards: {hand.length}</p>

        {displayDiscardButton && (
          <button
            onClick={handleDiscard}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Discard
          </button>
        )}
      </div>
    ) : (
      <div className="flex flex-col items-center space-y-1 h-48">
        {card ? (
          <Card card={card} isFaceUp={false} className="w-24 h-36 self-center rounded-lg shadow-lg" />
        ) : (
          <div className="w-24 h-36 self-center rounded-lg shadow-lg bg-gray-300 flex items-center justify-center text-gray-500 text-xs">No Card</div>
        )}
        <p className="text-sm font-medium text-gray-700">Cards: {hand.length}</p>
      </div>
    );

  const noCard = <div className="h-48"></div>; // Adjusted height

  return (
    <>
      <div
        className={`flex flex-col justify-center ${bgGradient} p-2 rounded-lg ${outlineStyle} transition-all duration-300 shadow-xl backdrop-blur-sm`}
      >
        <h1 className="text-center text-lg font-bold mb-1 text-gray-800">{name}</h1>
        {card ? displayCard : noCard}
      </div>
    </>
  );
}