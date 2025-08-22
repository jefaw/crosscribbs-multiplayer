import Board from "./Board";
import Player from "./Player";
import useCribbs from "../hooks/useCribbs";
import RoundScore from "./RoundScore";
import GameOver from "./GameOver";
import TurnIndicator from "./TurnIndicator";
import RoundHistory from "./RoundHistory";

export default function Game({ player1Name, player2Name, onGameOver }) {
  // const {
  //   board,
  //   turn,
  //   hand1,
  //   hand2,
  //   selectedCard,
  //   roundScoreVisible,
  //   playCard,
  //   nextRound,
  //   roundScores,
  //   totalScores,
  //   gameOver,
  //   winner,
  //   resetGame,
  //   roundHistory,
  //   currentRound,
  // } = useCribbs();

  const handleResetGame = () => {
    resetGame();
  };

  const handleBackToMenu = () => {
    resetGame();
    onGameOver();
  };

  return (
    /*
    Game Layout: 
      Player 1
      Board
      Player 2
     */
    <>
      <div className="flex flex-col xl:flex-row relative">
        <div className="w-100 xl:w-1/4">
          <div className="flex justify-start mb-4 pt-2">
            {!gameOver && (
              <button
                onClick={handleBackToMenu}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm transition-colors duration-200"
              >
                Back to Menu
              </button>
            )}
          </div>
          <Player name={player1Name} num={1} hand={hand1} turn={turn} />
        </div>
        <div className="w-100 xl:w-1/2">
          <Board board={board} selectedCard={selectedCard} playCard={playCard} />
        </div>
        <div className="w-100 xl:w-1/4">
          <Player name={player2Name} num={2} hand={hand2} turn={turn} />
        </div>
        {roundScoreVisible && !gameOver && (
          <RoundScore nextRound={nextRound} roundScores={roundScores} totalScores={totalScores} />
        )}
        {gameOver && (
          <GameOver
            winner={winner}
            totalScores={totalScores}
            resetGame={handleResetGame}
            roundHistory={roundHistory}
            onBackToMenu={handleBackToMenu}
          />
        )}
        {!gameOver && <TurnIndicator turn={turn} player1Name={player1Name} player2Name={player2Name} />}
        <RoundHistory roundHistory={roundHistory} />
      </div>
    </>
  );
}
