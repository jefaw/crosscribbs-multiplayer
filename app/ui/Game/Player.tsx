/*
- Shows player's name
- Displays current top card
- Shows number of cards remaining
- Handles card selection and drag events
*/

import type { CardType } from "@shared/types/CardType";
import { socket } from "~/connections/socket";

type ChildProps = {
  name: String;
  num: number;
  hand: CardType[];
  turn: number;
  crib: CardType[];
  numPlayers: number;
};

export default function Player({ name, num, hand, turn, crib, numPlayers }: ChildProps) {
  // hand = props.hand

  //Get top card
  const card = hand.length > 0 ? hand[hand.length - 1] : false;
  const backImgSrc = `cards/backs/red2.svg`; // can be changed in future

  function handleDragStart(e: any) {
    e.dataTransfer.effectAllowed = "move"; // don't show plus icon on drag
  }

  function handleDiscard() {
    if (card) {
      socket.emit("discardToCrib", { player: turn, card });
    }
  }

  const isActive = num === turn;
  const borderColor = num % 2 === 0 ? "border-cyan-400" : "border-fuchsia-400";
  const borderStyle = isActive ? `border-8 ${borderColor}` : "border-2 border-stone-700";
  const bgGradient =
    num === 1 ? "bg-gradient-to-br from-slate-100 to-slate-200" : "bg-gradient-to-br from-slate-100 to-slate-200";

  // Only show card if it's the player's turn
  const displayCard =
    isActive && card ? (
      <div className="flex flex-col items-center space-y-2">
        <img
          className="w-36 h-auto self-center hover:border-gray-700 border-transparent border-2 cursor-pointer rounded-lg shadow-lg transition-transform hover:scale-105"
          src={card.frontImgSrc}
          alt=""
          draggable={true}
          onDragStart={handleDragStart}
        />
        <p className="text-base font-medium text-gray-700">Cards remaining: {hand.length}</p>
        {crib.length < 4 && (
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
        <img className="w-36 h-auto self-center rounded-lg shadow-lg" src={backImgSrc} alt="" draggable={false} />
        <p className="text-base font-medium text-gray-700">Cards remaining: {hand.length}</p>
      </div>
    );

  return (
    <>
      <div
        className={`flex flex-col justify-center ${bgGradient} m-8 py-6 px-4 rounded-lg ${borderStyle} transition-all duration-300 shadow-xl backdrop-blur-sm`}
      >
        <h1 className="text-center text-xl font-bold mb-3 text-gray-800">{name}</h1>
        {card ? displayCard : null}
      </div>
    </>
  );
}
