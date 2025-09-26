import type { CardSizesType, CardType } from "@cross-cribbs/shared-types/CardType";

interface CribProps {
  crib: CardType[];
  dealer: number | null;
  cardSizes: CardSizesType;
}

export default function Crib({ crib, dealer, cardSizes }: CribProps) {
  const backImgSrc = `/cards/backs/red2.svg`;
  const dealerTeam = dealer ? (dealer % 2 !== 0 ? "Row" : "Column") : "";
  const MAX_CARDS = 4;

  return (
    <div className="bg-slate-600 p-3 m:p-4 rounded-lg shadow-lg">
      <h3 className="text-white text-center font-bold text-sm md:text-lg mb-3">Crib: {dealerTeam}</h3>
      <div className="flex space-x-3">
        <div className="flex space-x-2">
          {Array.from({ length: MAX_CARDS }).map((_, i) => {
            const card = crib[i]; // get the card if it exists
            return (
              <img
                key={i}
                className={`${cardSizes.base} ${cardSizes.md} ${cardSizes.xl} rounded-md shadow-lg ${
                  card ? "" : "invisible"
                }`}
                src={card ? card.frontImgSrc : backImgSrc} // optional: could keep backImgSrc or leave blank
                alt=""
              />
            );
          })}
        </div>

        {/* {crib.map((card, i) => (
          <img
            key={i}
            className={`${cardSizes.base} ${cardSizes.md} ${cardSizes.xl} rounded-md shadow-lg `}
            src={backImgSrc}
            alt="Card back"
          />
        ))}
        {crib.length === 0 &&
          Array.from({ length: 4 }).map((_, index) => (
            // The key prop is required for lists in React
            <img
              className={`invisible ${cardSizes.base} ${cardSizes.md} ${cardSizes.xl} rounded-md shadow-lg `}
              src={backImgSrc}
              alt="Card back"
            />
          ))} */}
      </div>
      {/* <img
            className={`invisible ${cardSizes.base} ${cardSizes.md} ${cardSizes.xl} rounded-md shadow-lg `}
            src={backImgSrc}
            alt="Card back"
          /> */}
    </div>
  );
}
