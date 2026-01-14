import type { JSX } from "@emotion/react/jsx-runtime";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Chess } from "chess.js";
import { useState } from "react";
import { Chessboard } from "react-chessboard";

interface GameSetupProps {
  open: boolean;
  handlePlay: (chess: Chess) => void;
  handleClose: () => void;
}

export default function GameSetup({
  open,
  handlePlay,
  handleClose,
}: GameSetupProps): JSX.Element {
  const [depth, setDepth] = useState(4);
  const [FEN, setFEN] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [newGame, setNewGame] = useState(new Chess());

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Game setup</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="FEN Position"
              label="Paste FEN here"
              defaultValue={FEN}
              variant="standard"
              onChange={(event) => setFEN(event.target.value)}
            />
          </Box>
          <div style={{ width: "300px", height: "300px" }}>
            <Chessboard position={FEN} />
          </div>
          {/* <div className="timeControl"></div> */}
          <div className="strength">
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
          </div>
          <div className="side">
            <Typography>You play as</Typography>
            <div>
              <Button>White</Button>
              <Button>Black</Button>
              <Button>Random</Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handlePlay}>Play</Button> */}
          <Button>Play</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
