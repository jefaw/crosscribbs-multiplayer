type ChildProps = {
  turn: number;
  playerNames: string[];
  dealer: number | null;
};

export default function TurnIndicator({ turn, playerNames, dealer }: ChildProps) {
  const numPlayers = playerNames.length;
  const getTurnMessage = () => {
    if (numPlayers > 0 && turn > 0 && turn <= numPlayers) {
      return `${playerNames[turn - 1]}'s turn`;
    }
    return "";
  };

  return (
    <div className="bg-slate-600 text-white p-3 rounded-lg shadow-lg">
      {playerNames.map((name, index) => {
        const playerNum = index + 1;
        const isTurn = turn === playerNum;
        const isDealer = dealer === playerNum;
        const team = playerNum % 2 !== 0 ? "(Row)" : "(Column)";
        const teamColor = playerNum % 2 !== 0 ? "text-cyan-400" : "text-fuchsia-400";

        return (
          <div key={name} className="flex items-center space-x-2 mt-2">
            <div className={`w-3 h-3 rounded-full ${isTurn ? (playerNum % 2 !== 0 ? 'bg-cyan-400' : 'bg-fuchsia-400') : 'bg-gray-400'}`}></div>
            <span className={`font-bold ${isDealer ? 'text-yellow-400' : ''}`}>{name} {isDealer ? '(Dealer)' : ''}</span>
            <span className={`${teamColor} text-sm`}>{team}</span>
          </div>
        );
      })}
      <div className="mt-2 text-sm text-center">{getTurnMessage()}</div>
    </div>
  );
} 