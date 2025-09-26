/*
- Displays round summary when game ends
- Shows:
  - Row vs Column scores
  - Breakdown of scoring (pairs, runs, fifteens)
  - Total scores
  - Winner and point difference
*/

import type { BoardType } from "@cross-cribbs/shared-types/GameControllerTypes";
import type { CardSizesType, CardType } from "@cross-cribbs/shared-types/CardType";

type ChildProps = {
  nextRound: () => void;
  roundScores: any;
  totalScores: any;
  cribScore: any;
  dealer: number | null;
  crib: CardType[];
  board: BoardType;
  heels: number;
  cardSizes: CardSizesType;
};

export default function RoundScore({
  nextRound,
  roundScores,
  totalScores,
  cribScore,
  dealer,
  crib,
  board,
  heels,
  cardSizes,
}: ChildProps) {
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

  return (
    <div
      className="absolute inset-0 mx-auto my-auto w-[320px] h-[600px] md:w-[500px] md:h-[700px] p-5 bg-slate-600 opacity-95 text-white rounded-lg border-2 border-solid border-slate-800
      transition-opacity ease-in duration-700 text-sm"
    >
      <h2 className="text-center text-lg md:text-3xl mb-3">Round Summary</h2>
      <p className="font-semi-bold md:text-lg bg-emerald-600 rounded-md mb-1 italic w-fit px-4 mx-auto">
        {scoreDiff()} earns {Math.abs(rowTeamRoundScore - colTeamRoundScore)} points!
      </p>
      <div className="flex flex-col text-sm">
        <div className="w-full flex justify-around mb-1 text-center">
          <div>
            <h3 className="font-bold md:text-2xl text-cyan-400">Row</h3>
            <p className="md:text-xl text-cyan-400">Round Score: {rowTeamRoundScore}</p>
            <div className="text-left">
              {dealerTeam === "Row" && cribScore && <p className="text-orange-400">{cribPoints} (crib)</p>}
              {dealerTeam === "Row" && heels > 0 && <p className="text-orange-400">{heels} (Heels Jack)</p>}
            </div>
            <div className="text-left">
              <p>{roundScores[0].pairs} (pairs)</p>
              <p>{roundScores[0].runs} (runs)</p>
              <p>{roundScores[0].fifteens} (fifteens)</p>
              <p>{roundScores[0].flushes} (flushes)</p>
              <p>{roundScores[0].knobs} (knobs)</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold md:text-2xl text-fuchsia-400">Column</h3>
            <p className="md:text-xl text-fuchsia-400">Round Score: {colTeamRoundScore}</p>
            <div className="text-left">
              {dealerTeam === "Column" && cribScore && <p className="text-orange-400">{cribPoints} (crib)</p>}
              {dealerTeam === "Column" && heels > 0 && <p className="text-orange-400">{heels} (Heels - Center Jack)</p>}
            </div>
            <div className="text-left">
              <p>{roundScores[1].pairs} (pairs)</p>
              <p>{roundScores[1].runs} (runs)</p>
              <p>{roundScores[1].fifteens} (fifteens)</p>
              <p>{roundScores[1].flushes} (flushes)</p>
              <p>{roundScores[1].knobs} (knobs)</p>
            </div>
          </div>
        </div>
        {cribScore && (
          <div className="w-full flex justify-center mb-2 text-center">
            <div className="bg-slate-700 rounded-lg p-2">
              <h3 className="font-bold md:text-2xl">Crib ({dealerTeam})</h3>
              <div className="flex justify-center space-x-1 my-2">
                {cribHand.map((card, i) => (
                  <img
                    key={i}
                    src={`/cards/fronts/${card.suit}_${card.name}.svg`}
                    alt={`${card.name} of ${card.suit}`}
                    className={`${cardSizes.base} ${cardSizes.md} ${cardSizes.xl}`}
                  />
                ))}
              </div>
              <p className="md:text-2xl font-bold">{cribScore.total} points</p>
              <div className="flex justify-around mt-2">
                <p>{cribScore.pairs} (pairs)</p>
                <p>{cribScore.runs} (runs)</p>
                <p>{cribScore.fifteens} (fifteens)</p>
                <p>{cribScore.flushes} (flushes)</p>
              </div>
            </div>
          </div>
        )}
        <div className="bg-slate-700 rounded-lg p-2 md:mt-2">
          <h3 className="text-center md:text-xl">Total Scores</h3>
          <div className="flex justify-around mt-1">
            <div className="text-center">
              <p className="text-cyan-400 md:text-xl font-bold">Row</p>
              <p className="md:text-2xl">{totalScores[0]}</p>
            </div>
            <div className="text-center">
              <p className="text-fuchsia-400 md:text-xl font-bold">Column</p>
              <p className="md:text-2xl">{totalScores[1]}</p>
            </div>
          </div>
        </div>
        <button
          className="w-full bg-blue-500 text-white font-bold rounded-xl md:text-2xl border-white border-2 hover:bg-blue-600 py-2 mt-2 transition-colors duration-300 cursor-pointer"
          onClick={nextRound}
        >
          Next Round
        </button>
      </div>
    </div>
  );
}
