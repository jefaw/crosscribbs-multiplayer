import Player from "./Player";
import { socket } from "../../connections/socket";
import type { PlayerType } from "@cross-cribbs/shared-types/PlayerType";
import type { CardSizesType, CardType } from "@cross-cribbs/shared-types/CardType";

type ChildProps = {
  players: PlayerType[];
  playerNames: string[];
  numPlayers: number;
  lobbyId: string | undefined;
  turn: number;
  crib: CardType[];
  cardSizes: CardSizesType;
};

export default function PlayersDisplay({
  players,
  playerNames,
  numPlayers,
  lobbyId,
  turn,
  crib,
  cardSizes,
}: ChildProps) {
  return (
    <div className="players-display text-xs md:text-base ">
      <p className="md:text-xl font-medium ml-2">Row Team:</p>
      <div className="row-team md:mb-3">
        {numPlayers === 4 && (
          <div className="flex flex-row">
            <div className="w-1/2 md:w-full">
              <Player
                name={playerNames[0]}
                player={players[0]}
                turn={turn}
                crib={crib}
                numPlayers={numPlayers}
                lobbyId={lobbyId}
                playerId={socket.id}
                cardSizes={cardSizes}
              />
            </div>
            <div className="w-1/2 md:w-full">
              <Player
                name={playerNames[2]}
                player={players[2]}
                turn={turn}
                crib={crib}
                numPlayers={numPlayers}
                lobbyId={lobbyId}
                playerId={socket.id}
                cardSizes={cardSizes}
              />
            </div>
          </div>
        )}
        {numPlayers === 2 && (
          <Player
            name={playerNames[0]}
            player={players[0]}
            turn={turn}
            crib={crib}
            numPlayers={numPlayers}
            lobbyId={lobbyId}
            playerId={socket.id}
            cardSizes={cardSizes}
          />
        )}
      </div>
      <div className="col-team">
        <p className="md:text-xl font-medium ml-2 text-center md:text-left">Column Team:</p>
        {numPlayers === 4 && (
          <div className="flex flex-row">
            <div className="w-1/2 md:w-full">
              <Player
                name={playerNames[1]}
                player={players[1]}
                turn={turn}
                crib={crib}
                numPlayers={numPlayers}
                lobbyId={lobbyId}
                playerId={socket.id}
                cardSizes={cardSizes}
              />
            </div>
            <div className="w-1/2 md:w-full">
              <Player
                name={playerNames[3]}
                player={players[3]}
                turn={turn}
                crib={crib}
                numPlayers={numPlayers}
                lobbyId={lobbyId}
                playerId={socket.id}
                cardSizes={cardSizes}
              />
            </div>
          </div>
        )}
        {numPlayers === 2 && (
          <Player
            name={playerNames[1]}
            player={players[1]}
            turn={turn}
            crib={crib}
            numPlayers={numPlayers}
            lobbyId={lobbyId}
            playerId={socket.id}
            cardSizes={cardSizes}
          />
        )}
      </div>
    </div>
  );
}
