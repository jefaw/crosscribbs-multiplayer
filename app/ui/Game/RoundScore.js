/*
- Displays round summary when game ends
- Shows:
  - Row vs Column scores
  - Breakdown of scoring (pairs, runs, fifteens)
  - Total scores
  - Winner and point difference
*/
export default function RoundScore(props) {
  const { nextRound, roundScores, totalScores } = props;

  function scoreDiff() {
    let winner = roundScores[0].total() > roundScores[1].total() ? "Row" : "Column";

    return winner;
  }

  return (
    <div
      className="absolute inset-0 mx-auto my-auto w-[330px] h-[450px] p-5 bg-slate-600 opacity-95 text-white rounded-lg border-2 border-solid border-slate-800
      transition-opacity ease-in duration-700"
    >
      <h2 className="text-center text-3xl mb-3">Round Summary</h2>
      <div className="flex flex-col">
        <div className="w-full flex justify-center mb-3 text-center">
          <div>
            <h3 className="font-bold text-3xl text-cyan-400">Row</h3>
            <p className="text-2xl text-cyan-400">Round Score: {roundScores[0].total()}</p>
            <p className="text-1xl">
              {roundScores[0].pairs} (pairs) + {roundScores[0].runs} (runs) + {roundScores[0].fifteens} (fifteens)
            </p>
            <p className="text-2xl">Total Score: {totalScores[0]}</p>
          </div>
        </div>
        <div className="w-full flex justify-center mb-3 text-center ">
          <div>
            <h3 className="font-bold text-3xl text-fuchsia-400">Column</h3>
            <p className="text-2xl text-fuchsia-400">Round Score: {roundScores[1].total()}</p>
            <p className="text-1xl">
              {roundScores[1].pairs} (pairs) + {roundScores[1].runs} (runs) + {roundScores[1].fifteens} (fifteens)
            </p>
            <p className="text-2xl mb-2">Total Score: {totalScores[1]}</p>

            <p className="font-semi-bold text-xl bg-emerald-600 rounded-md mb-1 italic">
              {scoreDiff()} earns {Math.abs(roundScores[0].total() - roundScores[1].total())} points!
            </p>
          </div>
        </div>
        <button
          className="bg-amber-400 text-black rounded-xl text-2xl border-white border-2 hover:bg-yellow-500 mx-4"
          onClick={nextRound}
        >
          <span className="drop-shadow-md">Next Round</span>
        </button>
      </div>
    </div>
  );
}
