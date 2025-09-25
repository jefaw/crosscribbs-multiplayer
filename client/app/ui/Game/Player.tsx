/*
- Shows player's name
- Displays current top card
- Shows number of cards remaining
- Handles card selection and drag events
*/

import type { CardType } from "@cross-cribbs/shared-types/CardType";
import type { PlayerType } from "@cross-cribbs/shared-types/PlayerType";
import { socket } from "~/connections/socket";

type ChildProps = {
  name: String;
  player: PlayerType;
  turn: number;
  crib: CardType[];
  numPlayers: number;
  lobbyId: string | undefined;
  playerId: string | undefined;
};

export default function Player({ name, player, turn, lobbyId, numPlayers, playerId }: ChildProps) {
  const { hand, discardedToCrib } = player;
  // hand = props.hand

  //Get top card
  const card = hand.length > 0 ? hand[hand.length - 1] : false;
  const backImgSrc = `/cards/backs/red2.svg`; // can be changed in future

  function handleDragStart(e: any) {
    e.dataTransfer.effectAllowed = "move"; // don't show plus icon on drag
  }

  function handleDiscard() {
    if (card) {
      socket.emit("discardToCrib", { lobbyId, numPlayers, player, playerId, card });
    }
  }

  const isTurn = player.num === turn;
  const outlineColor = player.num % 2 === 0 ? "outline-cyan-400" : "outline-fuchsia-400";
  const outlineStyle = isTurn ? `outline-8 ${outlineColor}` : "outline-2 outline-stone-700";
  const bgGradient =
    player.num === 1
      ? "bg-gradient-to-br from-slate-100 to-slate-200"
      : "bg-gradient-to-br from-slate-100 to-slate-200";
  const cardImgSrc = isTurn && card ? card.frontImgSrc : backImgSrc;
  const displayDiscardButton = isTurn && (numPlayers == 2 ? discardedToCrib.length < 2 : discardedToCrib.length < 1);
  const displayDiscardButtonClass = displayDiscardButton ? "" : "invisible";
  const displayCardsLeft = card ? "" : "invisible";
  const displayCardImage = card ? "" : "invisible";
  // Only show card if it's the player's turn
  const gameInfo = (
    <div className="flex flex-col items-center space-y-2">
      <img
        className={`${displayCardImage} w-[77.25px] h-[108px] md:w-[81.9px] md:h-[116.55px] self-center hover:border-gray-700 border-transparent border-2 cursor-pointer rounded-lg shadow-lg transition-transform hover:scale-105`}
        src={cardImgSrc}
        alt=""
        draggable={true}
        onDragStart={handleDragStart}
      />
      <p className={`${displayCardsLeft} text-xs md:text-base font-medium text-gray-700`}>Cards: {hand.length}</p>

      <button
        onClick={handleDiscard}
        className={`${displayDiscardButtonClass} bg-red-500 hover:bg-red-700 text-white font-bold py-[6px] px-3 rounded text-xs md:text-sm`}
      >
        Discard to Crib
      </button>
    </div>
  );

  const noCard = <div className="h-66"></div>; // card height: 51 + p height: 5 + y-spcaing: 2

  return (
    <div
      className={`flex flex-col justify-center ${bgGradient} max-w-50 my-4 p-2 md:m-2 md:py-4 md:px-2 rounded-lg ${outlineStyle} transition-all duration-300 shadow-xl backdrop-blur-sm`}
    >
      <div className="flex items-center justify-center mb-1 md:mb-3">
        <h1 className="text-base md:text-xl font-bold text-gray-800">{name}</h1>
        {lobbyId && playerId === player.id && (
          <span className="bg-green-400 text-black px-2 rounded-full text-xs ml-2 italic">You</span>
        )}
      </div>
      {/* <h1 className="text-center text-xl font-bold mb-3 text-gray-800">{name}</h1>
        {playerId === player.id && <span className="bg-green-400 text-black px-2 rounded-full text-xs ml-2">You</span>} */}
      {gameInfo}
    </div>
  );
}
