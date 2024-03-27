import { useMemo, useState } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import { stockfishMoveButton,appContainer,sideContainer,chessboardContainer } from './style';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importujte štýly Bootstrap


function App() {
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [evaluation, setEvaluation] = useState('');
  const [opening, setOpening] = useState({});
  const [isActive, setIsActive] = useState(false);
  // Stav pre sledovanie orientácie šachovnice
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [depth, setDepth] = useState(13); // Default depth
  const [showModal, setShowModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [moveArrow, setMoveArrow] = useState(null);

  // Funkcia na zmenu orientácie šachovnice
  const toggleBoardOrientation = () => {
    setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white');
};

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
  if (!isActive) return;
  const position = game.fen();

  const options_2 = {
    method: 'GET',
    url: 'https://stockfish.online/api/s/v2.php',
    params: {
      fen: position,
      depth: depth,
    },
  };

  try {
    const response = await axios.request(options_2);
    if (response.data && response.data.success) {
      // Assuming the best move is in the format "bestmove [move] ponder [move]"
      // We split the string and take the second element (the move)
      const bestMove = response.data.bestmove.split(' ')[1];
      if (bestMove) {
        // Apply the best move to the game. This assumes your game object
        // has a method called 'move' that accepts moves in the format { from: 'b7', to: 'b6' }
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
        });

        
        // Update your game's position. This assumes you have a method setGamePosition
        // that takes the current game FEN string to update the app's state
        setGamePosition(game.fen());
        setMoveArrow(bestMove);
        await getOpening();
        console.log("Checking game over state:", game.game_over());
        if (game.game_over()) {
        const result = game.in_draw() ? 'Draw' : (game.in_checkmate() ? 'Checkmate' : 'Game Over');
        console.log("Game result:", result);
        setResultMessage(result);
        setShowModal(true);
      }
        
      }
    } else {
      console.error('No move found or error in response:', response.data);
    }
  } catch (error) {
    console.error('Error finding best move:', error);
  }
}
  

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
    if (!game.game_over() && !game.in_draw()) {
      findBestMove();
      evaluatePosition();
      getOpening();
    }else{
      const result = game.in_draw() ? 'Draw' : (game.in_checkmate() ? 'Checkmate' : 'Game Over');
      setResultMessage(result);
      setShowModal(true);
    }

    
    //getOpening();

    return true;
  }
  return (
    <div style={appContainer}>
      
      <div style={sideContainer}>
      <div className="d-grid gap-2">
      <Button variant="outline-dark" size="md" onClick={() => { game.reset(); setGamePosition(game.fen()); setMoveArrow(null) }}>
        New game
      </Button>
      <Button variant="outline-dark" size="md" onClick={() => { game.undo(); game.undo(); setGamePosition(game.fen()); setMoveArrow(null) }}>
        Undo
      </Button>
      <Button variant="outline-dark" size="lg" onClick={() => setIsActive(!isActive)} style={isActive ? stockfishMoveButton.activeButton : stockfishMoveButton.inactiveButton}>
          {isActive ? 'Deactivate ' : 'Activate '} 
          Best Move Finder
      </Button>
      <Button variant="outline-dark" size="md" onClick={toggleBoardOrientation}>
        Rotate Board
      </Button>
    </div>
      </div>
  
      <div style={chessboardContainer}>
        <Chessboard
          id="PlayVsStockfish"
          position={gamePosition}
          onPieceDrop={onDrop}
          onSquareClick={function noRefCheck(){}}
          boardOrientation={boardOrientation}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
          // style={{ width: '90%', height: 'auto' }} // Ensuring the chessboard is responsive within its container
          customArrows={moveArrow ? [[moveArrow.substring(0, 2), moveArrow.substring(2, 4), "rgb(0, 128, 0)"]] : []}
        />
      </div>
  
      <div style={sideContainer}>
        <Card style={{ width: '18rem' }} bg="dark" text="white" border="light">
          <Card.Body>Evaluation: {evaluation}</Card.Body>
        </Card>
        <Card style={{ width: '18rem' }}bg="dark" text="white" border="light">
          <Card.Body>Opening: {opening ? opening.name : 'Unknown'}</Card.Body>
        </Card>
        
        <div>
          <label htmlFor="depth">Depth:</label>
          <input
            id="depth"
            type="number"
            value={depth}
            onChange={(e) => setDepth(Math.min(15, Math.max(1, parseInt(e.target.value, 10))))}
            min="1"
            max="15"
          />
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Game Result</Modal.Title>
            </Modal.Header>
            <Modal.Body>{resultMessage}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {setShowModal(false); setMoveArrow(null)}}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => {
                    setShowModal(false);
                    game.reset();
                    setGamePosition(game.fen());
                    setMoveArrow(null);
                    // Akékoľvek ďalšie akcie na reštart hry
                }}>
                    New Game
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  );
  
  
}

export default App;
