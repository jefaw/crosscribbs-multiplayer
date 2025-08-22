import CardType from "@shared/types/CardType";

/*
- Spot component:
  - Handles drag and drop functionality
  - Shows either an empty spot or a played card
  - Manages card placement logic
*/

type ChildProps = {
  pos: number[];
  card: CardType;
  playCard: CardType;
};

export default function Spot({ pos, card, playCard }: ChildProps) {
  function handleDragOver(e: any) {
    e.stopPropagation();
    e.preventDefault();
  }

  function handleDrop(e: any) {
    e.preventDefault();
    playCard(pos);
  }

  const cardSpotStyles =
    "w-[103px] h-36 mx-10 mb-10 bg-stone-200 border-2 border-stone-700 hover:bg-blue-300 transition duration-300 cursor-pointer";

  if (card) {
    return (
      <td className={cardSpotStyles} onDragStart={(e) => (e.dataTransfer.effectAllowed = "move")}>
        <img className="h-100" src={card.frontImgSrc} alt="" draggable="false" />
      </td>
    );
  }
  // Show placeholder if no card played
  return (
    <td className={cardSpotStyles} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => playCard(pos)}></td>
  );
}
