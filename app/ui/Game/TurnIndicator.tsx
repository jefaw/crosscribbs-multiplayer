type ChildProps = {
  turn: any;
  player1Name: any;
  player2Name: any;
};

export default function TurnIndicator({ turn, player1Name, player2Name }: ChildProps) {
  return (
    <div className="fixed bottom-4 left-4 bg-slate-600 text-white p-3 rounded-lg shadow-lg">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${turn === 1 ? 'bg-cyan-400' : 'bg-gray-400'}`}></div>
        <span className="font-bold">{player1Name}</span>
        <span className="text-cyan-400 text-sm">(Row)</span>
      </div>
      <div className="flex items-center space-x-2 mt-2">
        <div className={`w-3 h-3 rounded-full ${turn === 2 ? 'bg-fuchsia-400' : 'bg-gray-400'}`}></div>
        <span className="font-bold">{player2Name}</span>
        <span className="text-fuchsia-400 text-sm">(Column)</span>
      </div>
      <div className="mt-2 text-sm text-center">
        {turn === 1 ? `${player1Name}'s turn` : `${player2Name}'s turn`}
      </div>
    </div>
  );
} 