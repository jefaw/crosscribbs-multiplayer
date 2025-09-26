import type { RoundHistoryType } from "@cross-cribbs/shared-types/GameControllerTypes";

type ChildProps = {
  winner: any;
  totalScores: any;
  resetGame: any;
  roundHistory: RoundHistoryType[];
  onBackToMenu: any;
};

export default function GameOver({ winner, totalScores, resetGame, roundHistory, onBackToMenu }: ChildProps) {
  return (
    <div
      className="absolute inset-0 mx-auto my-auto w-[330px] h-[450px] p-5 bg-slate-600 opacity-95 text-white rounded-lg border-2 border-solid border-slate-800
      transition-opacity ease-in duration-700 overflow-y-auto text-sm"
    >
      <h2 className="text-center text-2xl md:text-3xl md:mb-3 mb-1">Game Over!</h2>
      <div className="flex flex-col">
        <div className="w-full flex justify-center mb-1 md:mb-3 text-center">
          <div>
            <h3 className="font-bold text-lg md:text-3xl text-cyan-400">Row</h3>
            <p className="md:text-2xl">Total Score: {totalScores[0]}</p>
          </div>
        </div>
        <div className="w-full flex justify-center mb-1 md:mb-3 text-center">
          <div>
            <h3 className="font-bold text-lg md:text-3xl text-fuchsia-400">Column</h3>
            <p className="md:text-2xl mb-2">Total Score: {totalScores[1]}</p>
            <p className="font-semi-bold md:text-xl bg-emerald-600 rounded-md mb-1 italic">{winner} wins the game!</p>
          </div>
        </div>

        <div className="mt-1 md:mt-4 mb-4">
          <h3 className="text-lg font-bold mb-2">Round History</h3>
          <div className="space-y-2">
            {roundHistory.map((round) => (
              <div key={round.round} className="text-sm border-b border-slate-500 pb-1">
                <div className="flex justify-between">
                  <span>Round {round.round}:</span>
                  <span className={round.winner === "Row" ? "text-cyan-400" : "text-fuchsia-400"}>
                    {round.winner} +{round.pointDiff}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Row: {round.rowScore}</span>
                  <span>Column: {round.columnScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 mt-auto">
          <button
            onClick={resetGame}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg md:text-lg transition-colors duration-200"
          >
            Play Again
          </button>
          <button
            onClick={onBackToMenu}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg md:text-lg transition-colors duration-200"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
