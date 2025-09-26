import type { CardType } from "@cross-cribbs/shared-types/CardType";
import { socket } from "~/connections/socket";

interface DealerSelectionProps {
  dealerSelectionCards: CardType[];
  playerNames: string[];
}

export default function DealerSelection({ dealerSelectionCards, playerNames }: DealerSelectionProps) {
  const determineWinner = () => {
    let winner = 0;
    let lowestCard = 14;
    dealerSelectionCards.forEach((card, i) => {
      if (card.value < lowestCard) {
        lowestCard = card.value;
        winner = i + 1;
      }
    });
    return winner;
  };

  const handleSelectDealer = () => {
    const winner = determineWinner();
    socket.emit("selectDealer", winner);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Dealer Selection</h2>
        <p className="mb-4">Each player draws a card. The player with the lowest card becomes the dealer.</p>
        <div className="flex justify-center space-x-4 mb-4">
          {dealerSelectionCards.map((card, i) => (
            <div key={i} className="flex flex-col items-center">
              <p className="font-bold">{playerNames[i]}</p>
              <img
                src={`/cards/fronts/${card.suit}_${card.name}.svg`}
                alt={`${card.name} of ${card.suit}`}
                className="w-24 h-36"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSelectDealer}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
