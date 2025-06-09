import { useState } from "react";
import "./App.css";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

function App() {
  const [game, setGame] = useState(new Chess());

  function makeAMove(move: { from: string; to: string; promotion?: string }) {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    if (result === null) return null; // illegal move
    setGame(gameCopy);
    return gameCopy;
  }

  function makeRandomMove(currentGame: Chess) {
    const possibleMoves = currentGame.moves({ verbose: true });
    if (currentGame.isGameOver() || possibleMoves.length === 0) return;
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const gameCopy = new Chess(currentGame.fen());
    gameCopy.move(possibleMoves[randomIndex]);
    setGame(gameCopy);
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const updatedGame = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for simplicity
    });

    if (updatedGame === null) return false; // illegal move
    setTimeout(() => makeRandomMove(updatedGame), 200); // make a random move after a short delay
    return true;
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
    </>
  );
}

export default App;
