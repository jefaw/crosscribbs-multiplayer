type ChildProps = {
  totalScores: [number, number];
  backToMenu: () => void;
};
export default function Header({ totalScores, backToMenu }: ChildProps) {
  const rowScore = totalScores[0];
  const colScore = totalScores[1];

  return (
    <div className="Header bg-slate-700 flex flex-col">
      <div className="flex items-center md:p-2">
        <div className="left-buttons w-1/3 text-xs md:text-sm text-white p-2 ">
          <button
            className="bg-gray-500 hover:bg-gray-600 font-bold py-1.5 px-2 md:px-4 rounded transition-colors duration-200 mr-2"
            onClick={backToMenu}
          >
            Back to Menu
          </button>
          <button className="hidden md:inline bg-gray-500 hover:bg-gray-600 font-bold py-1.5 px-4 rounded transition-colors duration-200 mr-5">
            Instructions
          </button>
        </div>
        {/* <div className="title w-1/3"></div> */}
        <h1 className="title w-1/3 text-center text-lg md:text-2xl font-semibold">Cross Cribbs</h1>
        {/* pc score */}
        <div className="hidden md:flex total-score w-1/3 justify-end md:gap-4 text-[10px] md:text-xl font-medium md:mr-4 mr-2">
          <span>Total Score: </span>
          <span className="text-cyan-400">Row: {rowScore}</span>
          <span className="text-fuchsia-400">Column: {colScore}</span>
        </div>
      </div>

      {/* mobile score */}
      <div className="md:hidden flex justify-center gap-3 text-sm italic mb-2">
        <span>Total Score: </span>
        <span className="text-cyan-400">Row: {rowScore}</span>
        <span className="text-fuchsia-400">Column: {colScore}</span>
      </div>
    </div>
  );
}
