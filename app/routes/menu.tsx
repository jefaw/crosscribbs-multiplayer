import { useState } from "react";
import LocalOrOnline from "~/ui/GameSetup/LocalOrOnline";
import NumPlayers from "~/ui/GameSetup/NumPlayers";
import PlayerSetup from "~/ui/GameSetup/PlayerSetup";
import { useNavigate } from "react-router-dom";

type SetupPage = "gameType" | "numPlayers" | "playerSetup";
const pageOrder: SetupPage[] = ["gameType", "numPlayers", "playerSetup"];

export default function GameSetup() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<SetupPage>("gameType");
  const [gameType, setGameType] = useState<"local" | "online" | null>(null);
  const [numPlayers, setNumPlayers] = useState<2 | 4>(2);
  const [playerNames, setPlayerNames] = useState<[String, String]>(["", ""]);

  const goToNextPage = (next: SetupPage) => setCurrentPage(next);
  const goBack = () => {
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex > 0) {
      setCurrentPage(pageOrder[currentIndex - 1]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-transparent bg-clip-text">
          Cross Cribbs
        </h1>
      </div>
      <div className="bg-slate-700 p-8 rounded-lg shadow-xl w-[400px]">
        {currentPage === "gameType" && (
          <LocalOrOnline
            onSelect={(type) => {
              setGameType(type);
              goToNextPage("numPlayers");
            }}
          />
        )}
        {currentPage === "numPlayers" && (
          <NumPlayers
            onSelect={(numPlayers) => {
              setNumPlayers(numPlayers);
              goToNextPage("playerSetup");
            }}
            onBack={goBack}
          />
        )}
        {currentPage === "playerSetup" && (
          <PlayerSetup
            numPlayers={numPlayers}
            onSetPlayerNames={(playerNames) => {
              setPlayerNames(playerNames);
              navigate("/game", {
                state: { gameType, numPlayers, playerNames },
              });
            }}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
}
