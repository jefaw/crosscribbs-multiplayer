import React from 'react';
import RoundHistory from '~/ui/Game/RoundHistory';
import type { RoundHistoryType } from "@shared/types/GameControllerTypes";

interface RoundHistoryBoxProps {
  roundHistory: RoundHistoryType[];
}

const RoundHistoryBox: React.FC<RoundHistoryBoxProps> = ({ roundHistory }) => {
  return (
    <div className="bg-gray-700 text-white p-4 rounded-lg mt-4">
      <h3 className="text-lg font-bold mb-2">Round History</h3>
      <RoundHistory roundHistory={roundHistory} />
    </div>
  );
};

export default RoundHistoryBox;
