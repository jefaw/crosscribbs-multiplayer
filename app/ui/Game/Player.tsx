/*
- Shows player's name
- Displays current top card
- Shows number of cards remaining
- Handles card selection and drag events
*/

import type { CardType } from "@shared/types/CardType";
import type { PlayerType } from "@shared/types/PlayerType";
import { socket } from "~/connections/socket";

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
  const backImgSrc = `cards/backs/red2.svg`; // can be changed in future

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
      <div className="flex flex-col items-center space-y-2">
        <img
          className="w-36 h-51 self-center hover:border-gray-700 border-transparent border-2 cursor-pointer rounded-lg shadow-lg transition-transform hover:scale-105"
          src={card.frontImgSrc}
          alt=""
          draggable={true}
          onDragStart={handleDragStart}
        />
        <p className="text-base font-medium text-gray-700">Cards remaining: {hand.length}</p>
        {displayDiscardButton && (
          <button
            onClick={handleDiscard}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Discard to Crib
          </button>
        )}
      </div>
    ) : (
      <div className="flex flex-col items-center space-y-2">
        <img className="w-36 h-51 self-center rounded-lg shadow-lg" src={backImgSrc} alt="" draggable={false} />
        <p className="text-base font-medium text-gray-700 h-5">Cards remaining: {hand.length}</p>
      </div>
    );

  const noCard = <div className="h-58"></div>; // card height: 51 + p height: 5 + y-spcaing: 2

  return (
    <>
      <div
        className={`flex flex-col justify-center ${bgGradient} m-8 py-6 px-4 rounded-lg ${outlineStyle} transition-all duration-300 shadow-xl backdrop-blur-sm`}
      >
        <h1 className="text-center text-xl font-bold mb-3 text-gray-800">{name}</h1>
        {card ? displayCard : noCard}
      </div>
    </>
  );
}
