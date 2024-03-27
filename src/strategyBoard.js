import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Chess from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Button } from 'react-bootstrap';

function StrategyBoard() {
    const { id } = useParams();
    const [strategy, setStrategy] = useState(null);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1); // Začnite od -1, aby žiaden ťah nebol vykonaný na začiatku
    const game = useMemo(() => new Chess(), []);
    const [gamePosition, setGamePosition] = useState('start'); // Začnite s počiatočnou pozíciou

    useEffect(() => {
        const fetchStrategy = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/openings/${id}`);
                setStrategy(response.data);
            } catch (error) {
                console.error('Error fetching strategy details:', error);
            }
        };
        fetchStrategy();
    }, [id]);

    function handleNextMove() {
        if (strategy && currentMoveIndex < strategy.moves.length - 1) {
            setCurrentMoveIndex(prev => prev + 1);
        }
    }

    useEffect(() => {
        if (strategy && Array.isArray(strategy.moves) && currentMoveIndex >= 0) {
            game.reset(); // Reset game to start position
            strategy.moves.slice(0, currentMoveIndex + 1).forEach(move => {
                game.move(move);
            });
            setGamePosition(game.fen()); // Update board position
        }
    }, [currentMoveIndex, strategy, game]);

    if (!strategy) return <div>Loading strategy details...</div>;

    return (
        <div>
            <h2>{strategy.name}</h2>
            <p>{strategy.moves ? strategy.moves.join(' ') : ''}</p>
            <Chessboard
                id="strategy-board"
                position={gamePosition}
                boardWidth={400}
                customBoardStyle={{ borderRadius: '5px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}
            />
            <Button variant="outline-dark" size="md" onClick={() => { game.reset(); setGamePosition('start'); setCurrentMoveIndex(-1); }}>
                New Game
            </Button>
            <Button variant="primary" onClick={handleNextMove} disabled={currentMoveIndex >= strategy.moves.length - 1}>
                Next Move
            </Button>
        </div>
    );
}

export default StrategyBoard;
