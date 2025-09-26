import { useEffect, useState } from "react";
import LocalOrOnline from "~/ui/GameSetup/LocalOrOnline";
import NumPlayers from "~/ui/GameSetup/NumPlayers";
import PlayerSetup from "~/ui/GameSetup/PlayerSetup";
import { useNavigate } from "react-router-dom";
import { socket } from "~/connections/socket";
import type { GameStateType } from "@cross-cribbs/shared-types/GameControllerTypes";

type SetupPage = "gameType" | "numPlayers" | "playerSetup";
const pageOrder: SetupPage[] = ["gameType", "numPlayers", "playerSetup"];

export default function GameSetup() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<SetupPage>("gameType");
  const [gameType, setGameType] = useState<"local" | "online" | null>(null);
  const [numPlayers, setNumPlayers] = useState<2 | 4>(2);
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  useEffect(() => {
    socket.on("gameStateUpdate", (gameState: GameStateType) => {
      // This means the game has started
      console.log("Game started, navigating to game page.", gameState);
      console.log(
        `gamestate = ${gameState} gameType = ${gameType} numPlayers=${numPlayers} playerNames=${playerNames}`
      );
      navigate("/game", { state: { initialGameState: gameState, gameType, numPlayers, playerNames } });
    });

    return () => {
      socket.off("gameStateUpdate");
    };
  }, [navigate, numPlayers, playerNames]);

  const goToNextPage = (next: SetupPage) => setCurrentPage(next);
  const goBack = () => {
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex > 0) {
      setCurrentPage(pageOrder[currentIndex - 1]);
    } else if (currentIndex === 0) {
      navigate("/");
    }
  };
  const setLocalSettings = () => {
    socket.emit("setLocalSettings", gameType, numPlayers, playerNames);
  };

  const handleSetPlayerNames = (playerNames: string[]) => {
    setPlayerNames(playerNames);
    socket.emit("startGame", { numPlayers });
    // console.log("player names esk = ", playerNames);
    // navigate("/game", {
    //   state: { gameType, numPlayers, playerNames },
    // });
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
            onBack={goBack}
          />
        )}
        {currentPage === "numPlayers" && (
          <NumPlayers
            onSelect={(numPlayers) => {
              console.log("numpipiPlayers = ", numPlayers);
              setNumPlayers(numPlayers);
              goToNextPage("playerSetup");
            }}
            onBack={goBack}
          />
        )}
        {currentPage === "playerSetup" && (
          <PlayerSetup numPlayers={numPlayers} onSetPlayerNames={handleSetPlayerNames} onBack={goBack} />
        )}
      </div>
    </div>
  );
}
