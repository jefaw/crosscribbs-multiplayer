type ChildProps = {
  totalScores: [number, number];
  backToMenu: () => void;
};
export default function Header({ totalScores, backToMenu }: ChildProps) {
  const rowScore = totalScores[0];
  const colScore = totalScores[1];
  return (
    <div className="Header flex bg-slate-700 items-center md:p-2">
      <div className="left-buttons p-2 w-1/3 text-xs md:text-sm text-white ">
        <button
          className="bg-gray-500 hover:bg-gray-600 font-bold py-1.5 px-2 md:px-4 rounded transition-colors duration-200 mr-2"
          onClick={backToMenu}
        >
          Back to Menu
        </button>
        <button className="hidden md:block bg-gray-500 hover:bg-gray-600 font-bold py-1.5 px-4 rounded transition-colors duration-200 mr-5">
          Instructions
        </button>
      </div>
      {/* <div className="title w-1/3"></div> */}
      <h1 className="title w-1/3 text-center text-sm md:text-2xl font-semibold">Cross Cribbs</h1>
      <div className="total-score w-1/3 flex justify-end md:gap-4 text-[10px] md:text-xl font-medium md:mr-4 mr-2">
        <span>Total Score: </span>
        <span className="text-cyan-400">Row: {rowScore}</span>
        <span className="text-fuchsia-400">Column: {colScore}</span>
      </div>
    </div>
  );
}
