import type { RoundHistoryType } from "@shared/types/GameControllerTypes";

type ChildProps = {
  roundHistory: RoundHistoryType[];
};

export default function RoundHistory({ roundHistory }: ChildProps) {
  if (roundHistory.length === 0) return null;

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
    <div className="space-y-3">
      {reversedHistory.map((round, index) => (
        <div key={round.round} className="text-sm border-b border-slate-500 pb-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium">Round {round.round}</span>
            <span className={`font-bold ${round.winner === "Row" ? "text-cyan-400" : "text-fuchsia-400"}`}>
              {round.winner} +{round.pointDiff}
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-300 mt-0">
            <span>Row: {round.rowScore}</span>
            <span>Column: {round.columnScore}</span>
          </div>
          <div className="flex justify-between text-xs mt-0">
            <span className="text-cyan-400">Total: {reversedTotals[index].rowTotal}</span>
            <span className="text-fuchsia-400">Total: {reversedTotals[index].columnTotal}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
