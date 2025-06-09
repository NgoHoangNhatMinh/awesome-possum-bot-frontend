import "./App.css";
import { Chessboard } from "react-chessboard";

function App() {
  return (
    <>
      <div style={{ width: "400px", height: "400px" }}>
        <Chessboard id="BasicBoard" />
      </div>
    </>
  );
}

export default App;
