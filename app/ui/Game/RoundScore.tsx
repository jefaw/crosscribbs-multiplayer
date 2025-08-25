/*
- Displays round summary when game ends
- Shows:
  - Row vs Column scores
  - Breakdown of scoring (pairs, runs, fifteens)
  - Total scores
  - Winner and point difference
*/

import type { BoardType } from "@shared/types/BoardTypes";
import type { CardType } from "@shared/types/CardType";

type ChildProps = {
  nextRound: () => void;
  roundScores: any;
  totalScores: any;
  cribScore: any;
  dealer: number | null;
  crib: CardType[];
  board: BoardType;
};

export default function RoundScore({ nextRound, roundScores, totalScores, cribScore, dealer, crib, board }: ChildProps) {
  function scoreDiff() {
    let winner = roundScores[0].total > roundScores[1].total ? "Row" : "Column";

    return winner;
  }

  const dealerTeam = dealer ? (dealer % 2 !== 0 ? "Row" : "Column") : "";
  const cutCard = board[2][2];
  const cribHand = cutCard ? [...crib, cutCard] : crib;

  const rowTeamRoundScore = roundScores[0].total;
  const colTeamRoundScore = roundScores[1].total;
  const cribPoints = cribScore ? cribScore.total : 0;

  const rowTeamSubtotal = dealerTeam === "Row" ? rowTeamRoundScore + cribPoints : rowTeamRoundScore;
  const colTeamSubtotal = dealerTeam === "Column" ? colTeamRoundScore + cribPoints : colTeamRoundScore;

  return (
    <div
      className="absolute inset-0 mx-auto my-auto w-[330px] h-[650px] p-5 bg-slate-600 opacity-95 text-white rounded-lg border-2 border-solid border-slate-800
      transition-opacity ease-in duration-700 overflow-auto"
    >
      <h2 className="text-center text-3xl mb-3">Round Summary</h2>
      <div className="flex flex-col">
        <div className="w-full flex justify-center mb-3 text-center">
          <div>
            <h3 className="font-bold text-3xl text-cyan-400">Row</h3>
            <p className="text-2xl text-cyan-400">Round Score: {rowTeamRoundScore}</p>
            {dealerTeam === "Row" && cribScore && (
              <p className="text-lg">+ {cribPoints} (crib)</p>
            )}
            <p className="text-1xl">
              {roundScores[0].pairs} (pairs) + {roundScores[0].runs} (runs) + {roundScores[0].fifteens} (fifteens) + {roundScores[0].knobs} (knobs)
            </p>
            <p className="text-2xl">Total Score: {totalScores[0]}</p>
          </div>
        </div>
        <div className="w-full flex justify-center mb-3 text-center ">
          <div>
            <h3 className="font-bold text-3xl text-fuchsia-400">Column</h3>
            <p className="text-2xl text-fuchsia-400">Round Score: {colTeamRoundScore}</p>
            {dealerTeam === "Column" && cribScore && (
              <p className="text-lg">+ {cribPoints} (crib)</p>
            )}
            <p className="text-1xl">
              {roundScores[1].pairs} (pairs) + {roundScores[1].runs} (runs) + {roundScores[1].fifteens} (fifteens) + {roundScores[1].knobs} (knobs)
            </p>
            <p className="text-2xl mb-2">Total Score: {totalScores[1]}</p>

            <p className="font-semi-bold text-xl bg-emerald-600 rounded-md mb-1 italic">
              {scoreDiff()} earns {Math.abs(rowTeamSubtotal - colTeamSubtotal)} points!
            </p>
          </div>
        </div>
        {cribScore && (
          <div className="w-full flex justify-center mb-3 text-center">
            <div>
              <h3 className="font-bold text-2xl">Crib Score ({dealerTeam})</h3>
              <div className="flex justify-center space-x-1 my-2">
                {cribHand.map((card, i) => (
                  <img key={i} src={`/cards/fronts/${card.suit}_${card.name}.svg`} alt={`${card.name} of ${card.suit}`} className="w-16 h-auto" />
                ))}
              </div>
              <p className="text-xl">{cribScore.total} points</p>
              <p className="text-sm">
                {cribScore.pairs} (pairs) + {cribScore.runs} (runs) + {cribScore.fifteens} (fifteens) + {cribScore.knobs} (knobs)
              </p>
            </div>
          </div>
        )}
        <button
          className="bg-amber-400 text-black rounded-xl text-2xl border-white border-2 hover:bg-yellow-500 mx-4 mt-4"
          onClick={nextRound}
        >
          <span className="drop-shadow-md">Next Round</span>
        </button>
      </div>
    </div>
  );
}
