import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Chess from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Button,Card } from 'react-bootstrap';

function FideGames() {
    const { id } = useParams();
    const [gameData, setGameData] = useState(null);
    const [currentMove, setCurrentMove] = useState(0);
    const [moves, setMoves] = useState([]);
    const chess = useMemo(() => new Chess(), []);
    const [gamePosition, setGamePosition] = useState('start');
    const [evaluation, setEvaluation] = useState('');


    async function evaluatePosition() {
        const position = chess.fen();
        const depth = 13;
        const mode = "eval"
        const options_1 = {
          method: 'GET',
          url: 'https://stockfish.online/api/s/v2.php',
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

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/chess/games/${id}`);
                setGameData(response.data);
                chess.load_pgn(response.data.pgn);
                setMoves(chess.history({ verbose: true }));
                chess.reset(); // Reset game to start position after loading moves
            } catch (error) {
                console.error('Error fetching game details:', error);
            }
        };
        fetchGame();
    }, [id, chess]);

    const handleNext = () => {
        if (currentMove < moves.length) {
            chess.move(moves[currentMove].san);
            setCurrentMove(currentMove + 1);
            setGamePosition(chess.fen());
            evaluatePosition();
        }
    };

    const handlePrev = () => {
        if (currentMove > 0) {
            chess.undo();
            setCurrentMove(currentMove - 1);
            setGamePosition(chess.fen());
            evaluatePosition();
        }
    };

    const handleReset = () => {
        chess.reset();
        setCurrentMove(0);
        setGamePosition(chess.fen());
        evaluatePosition();
    };

    return (
        <div style={{alignContent:'center'}}>
            <Chessboard 
            position={gamePosition} 
            boardWidth={400}
            customBoardStyle={{ borderRadius: '5px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}
            />
            <div className="controls">
                <Button onClick={handlePrev} disabled={currentMove <= 0}>Previous</Button>
                <Button onClick={handleNext} disabled={currentMove >= moves.length}>Next</Button>
                <Button onClick={handleReset}>Reset</Button>
            </div>
            <Card style={{ width: '18rem' }} bg="dark" text="white" border="light">
          <Card.Body>Evaluation: {evaluation}</Card.Body>
            </Card> 
        </div>
    );
}

export default FideGames;
