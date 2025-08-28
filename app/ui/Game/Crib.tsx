import React from 'react';
import type { CardType } from "@shared/types/CardType";
import Card from "./Card";

interface CribProps {
  cribCards?: CardType[] | null;
}

const Crib: React.FC<CribProps> = ({ cribCards }) => {
  return (
    <div className="bg-gray-700 text-white p-4 rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-2">Crib</h3>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: cribCards?.length || 0 }).map((_, index) => (
          <img
            key={index}
            src="/cards/backs/blue.svg"
            alt="Card Back"
            className="w-20 h-28 object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default Crib;
