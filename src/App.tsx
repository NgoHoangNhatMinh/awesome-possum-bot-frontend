import { useState } from "react";
import "./App.css";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import axios from "axios";
import Alert from "@mui/material/Alert";
import GameSetup from "./GameSetup";

function App() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [warning, setWarning] = useState(true);
  const [previousState, setPreviousState] = useState(new Chess());
  const [game, setGame] = useState(new Chess());
  const [isWaitingForMove, setIsWaitingForMove] = useState(false);
  const [depth, setDepth] = useState(4);
  const [openMenu, setOpenMenu] = useState(true);

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

  function handleUndo() {
    if (previousState.fen() === game.fen()) return;
    setGame(previousState);
  }

  function handleNewGame() {
    // setGame(new Chess());
    setOpenMenu(true);
  }

  const handlePlay = () => {};

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  return (
    <>
      <GameSetup
        open={openMenu}
        handlePlay={handlePlay}
        handleClose={handleCloseMenu}
      ></GameSetup>
      {warning && (
        <Alert
          severity="warning"
          onClose={() => {
            setWarning(false);
          }}
        >
          Backend is hosted on a free tier and may take ~30–60 seconds to cold
          start. Try restarting the page if the engine does not response.
        </Alert>
      )}
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
          <button onClick={() => {}}>Resign</button>
          <button onClick={handleNewGame}>New game</button>
        </div>
      </div>
    </>
  );
}

export default App;
