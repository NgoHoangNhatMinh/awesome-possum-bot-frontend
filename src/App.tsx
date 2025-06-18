import { useState } from "react";
import "./App.css";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import axios from "axios";

function App() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [previousState, setPreviousState] = useState(new Chess());
  const [game, setGame] = useState(new Chess());
  const [isWaitingForMove, setIsWaitingForMove] = useState(false);
  const [depth, setDepth] = useState(4);

  function makeAMove(move: { from: string; to: string; promotion?: string }) {
    const gameCopy = new Chess(game.fen());
    console.log("Attempting move:", move);
    const result = gameCopy.move(move);
    if (result === null) return null;
    setGame(gameCopy);
    return gameCopy;
  }

  function makeBestMove(currentGame: Chess) {
    const fen = currentGame.fen();
    const bestMove = axios
      .post(`${BACKEND_URL}/best`, { fen, depth })
      .then((response) => {
        const move = {
          from: response.data.fromString,
          to: response.data.toString,
          promotion: "q",
        };
        console.log("Best move received:", move);
        if (move) {
          const gameCopy = new Chess(currentGame.fen());
          gameCopy.move(move);
          setGame(gameCopy);
        }
      })
      .catch((error) => {
        console.error("Error fetching best move:", error);
      })
      .finally(() => {
        setIsWaitingForMove(false);
      });
    return bestMove;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    if (isWaitingForMove) return false;
    setPreviousState(game);
    const updatedGame = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (updatedGame === null) return false;
    setIsWaitingForMove(true);
    makeBestMove(updatedGame);
    return true;
  }

  function handleRestartGame() {
    setGame(new Chess());
  }

  function handleUndo() {
    if (previousState.fen() === game.fen()) return;
    setGame(previousState);
  }

  return (
    <>
      <div className="container">
        <label htmlFor="">
          Search depth: {depth}
          <br />
          <input
            type="range"
            min={1}
            max={7}
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            style={{ width: "150px" }}
          />
        </label>
        <div style={{ width: "400px", height: "400px" }}>
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            autoPromoteToQueen={true}
          />
        </div>
        <br />
        <div>
          {game.isCheckmate()
            ? "CHECKMATE"
            : isWaitingForMove
            ? "Thinking..."
            : "It's your turn"}
        </div>
        <div className="buttons">
          <button onClick={handleUndo}>Undo Move</button>
          <button onClick={handleRestartGame}>Restart game</button>
        </div>
      </div>
    </>
  );
}

export default App;
