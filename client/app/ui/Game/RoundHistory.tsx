import type { RoundHistoryType } from "@cross-cribbs/shared-types/GameControllerTypes";

type ChildProps = {
  roundHistory: RoundHistoryType[];
};

export default function RoundHistory({ roundHistory }: ChildProps) {
  // if (roundHistory.length === 0) return null;

  // Calculate running totals in chronological order
  let rowTotal = 0;
  let columnTotal = 0;
  const chronologicalTotals = roundHistory.map((round) => {
    if (round.winner === "Row") {
      rowTotal += round.pointDiff;
    } else {
      columnTotal += round.pointDiff;
    }
    return { rowTotal, columnTotal };
  });

  // Reverse both the history and totals to display newest first
  const reversedHistory = [...roundHistory].reverse();
  const reversedTotals = [...chronologicalTotals].reverse();

  return (
    <div className="hidden md:block bg-slate-600 w-full text-white p-4 rounded-lg shadow-lg min-h-[300px] lg:min-h-[450px] max-h-[450px] lg:max-h-[500px] overflow-y-auto">
      <h3 className="text-lg font-bold mb-3 text-center">Round History</h3>
      <div className="space-y-3">
        {reversedHistory.map((round, index) => (
          <div key={round.round} className="text-sm border-b border-slate-500 pb-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Round {round.round}</span>
              <span className={`font-bold ${round.winner === "Row" ? "text-cyan-400" : "text-fuchsia-400"}`}>
                {round.winner} +{round.pointDiff}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-300 mt-1">
              <span>Row: {round.rowScore}</span>
              <span>Column: {round.columnScore}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-cyan-400">Total: {reversedTotals[index].rowTotal}</span>
              <span className="text-fuchsia-400">Total: {reversedTotals[index].columnTotal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
