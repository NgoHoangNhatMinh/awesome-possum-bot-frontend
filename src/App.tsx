import { useState } from "react";
import "./App.css";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import axios from "axios";

function App() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [game, setGame] = useState(new Chess());

  function makeAMove(move: { from: string; to: string; promotion?: string }) {
    const gameCopy = new Chess(game.fen());
    console.log("Attempting move:", move);
    const result = gameCopy.move(move);
    if (result === null) return null; // illegal move
    setGame(gameCopy);
    return gameCopy;
  }

  // function makeRandomMove(currentgame: Chess) {
  //   const possiblemoves = currentgame.moves({ verbose: true });
  //   if (currentgame.isGameOver() || possiblemoves.length === 0) return;
  //   const randomindex = Math.floor(Math.random() * possiblemoves.length);
  //   const gamecopy = new Chess(currentgame.fen());
  //   const move = possiblemoves[randomindex];
  //   console.log("Random move chosen:", move);
  //   gamecopy.move(move);
  //   setGame(gamecopy);
  // }

  function makeBestMove(currentGame: Chess) {
    const fen = currentGame.fen();
    const bestMove = axios
      .post(`${BACKEND_URL}/best`, { fen })
      .then((response) => {
        const move = {
          from: response.data.fromString,
          to: response.data.toString,
          // promotion: "q",
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
      });
    return bestMove;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const updatedGame = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for simplicity
    });

    if (updatedGame === null) return false; // illegal move
    // setTimeout(() => makeRandomMove(updatedGame), 200); // make a random move after a short delay
    // setTimeout(() => makeBestMove(updatedGame), 200); // make a random move after a short delay
    makeBestMove(updatedGame);
    return true;
  }

  function handleRestartGame() {
    setGame(new Chess());
  }

  return (
    <>
      <div style={{ width: "400px", height: "400px" }}>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          autoPromoteToQueen={true}
        />
      </div>
      <br />
      <button onClick={handleRestartGame}>Restart game</button>
    </>
  );
}

export default App;
