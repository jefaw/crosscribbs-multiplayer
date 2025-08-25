import type { CardType } from "@shared/types/CardType";

interface CribProps {
  crib: CardType[];
  dealer: number | null;
}

export default function Crib({ crib, dealer }: CribProps) {
  const backImgSrc = `cards/backs/red2.svg`;
  const dealerTeam = dealer ? (dealer % 2 !== 0 ? "Row" : "Column") : "";

  return (
    <div className="bg-gray-800 p-2 rounded-lg shadow-lg">
      <h3 className="text-white text-center font-bold mb-1 text-sm">Crib: {dealerTeam}</h3>
      <div className="flex space-x-1">
        {crib.map((card, i) => (
          <img key={i} className="w-12 h-auto rounded-md shadow-lg" src={backImgSrc} alt="Card back" />
        ))}
      </div>
    </div>
  );
}