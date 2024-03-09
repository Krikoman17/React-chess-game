import './App.css';
import { useMemo, useState } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import { buttonStyle,boardWrapper,stockfishMoveButton } from './style';
import axios from 'axios';

function App() {
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [evaluation, setEvaluation] = useState('');
  const [opening, setOpening] = useState({});
  const [isActive, setIsActive] = useState(false);

  async function getOpening() {
    const currentFen = game.fen();
    const currentFenPosition = currentFen.split(' ')[0]; // Berieme len prvú časť FEN reťazca // Získanie aktuálnej FEN pozície
    console.log("Current FEN:", currentFen);
    const options_2 = {
      method: 'GET',
      url:'http://localhost:8080/openings',
    };
    try {
      const response_2 = await axios.request(options_2);
      const openings = response_2.data;
      // Hľadáme zhodu s aktuálnou FEN pozíciou
      const matchingOpening = openings.find(opening => opening.fen.split(' ')[0] === currentFenPosition);
      if (matchingOpening) {
        console.log("Match found:", matchingOpening);
        setOpening(matchingOpening); // Uložiť celé otvorenie, alebo len časť podľa potreby
    } else {
        console.log("No matching opening found");
        setOpening(null); // Alebo akúkoľvek inú predvolenú akciu, keď sa zhoda nenájde
    }
    } catch (error) {
      console.error(error);
    }
  }
  
  

  async function evaluatePosition() {
    const position = game.fen();
    const depth = 13;
    const mode = "eval"
    const options_1 = {
      method: 'GET',
      url: 'https://stockfish.online/api/stockfish.php',
      params: {
        fen: position,
        depth: depth,
        mode: mode,
      }
    };

    try {
      const response = await axios.request(options_1);
      setEvaluation(response.data.data);
      //how to display the evaluation on website
      console.log(evaluation);

    } catch (error) {
      console.error(error);
  }
}
  

  async function findBestMove() {
    if(!isActive) return;
const encodedParams = new URLSearchParams();
const posiotion_Fen = game.fen();
encodedParams.set('fen', posiotion_Fen);

const options = {
  method: 'POST',
  url: 'https://chess-stockfish-16-api.p.rapidapi.com/chess/api',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': 'a1bcd16d0fmsh42fe71c09c226b8p1cb35bjsn0ae77f4b35dd',
    'X-RapidAPI-Host': 'chess-stockfish-16-api.p.rapidapi.com'
  },
  data: encodedParams,
};

try {
	const response = await axios.request(options);
	console.log(response.data);
   // Extract the best move from the response
   const bestMove = response.data.bestmove;
   // Apply the best move to the game
   game.move({
    from: bestMove.substring(0, 2),
    to: bestMove.substring(2, 4),
  });
  setGamePosition(game.fen());
} catch (error) {
	console.error(error);
}

  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setGamePosition(game.fen());

    // illegal move
    if (move === null) return false;

    // exit if the game is over
    if (game.game_over() || game.in_draw()) return false;

    findBestMove();
    evaluatePosition();
    getOpening();

    return true;
  }
  return (
    <div style={boardWrapper}>
      

      <Chessboard
        id="PlayVsStockfish"
        position={gamePosition}
        onPieceDrop={onDrop}
      />

      <button
        style={buttonStyle}
        onClick={() => {
          game.reset();
          setGamePosition(game.fen());
        }}
      >
        New game
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          game.undo();
          game.undo();
          setGamePosition(game.fen());
        }}
      >
        Undo
      </button>
      <button onClick={() => setIsActive(!isActive)} 
      style={isActive ? stockfishMoveButton.activeButton : stockfishMoveButton.inactiveButton}>
        {isActive ? 'Deactivate ' : 'Activate '} 
        Best Move Finder
      </button>
      <div>
        <p>Evaluation : {evaluation}</p>
        <p>Opening: {opening ? opening.name : 'Unknown'}</p>
      </div>
    </div>
  
  );
}

export default App;
