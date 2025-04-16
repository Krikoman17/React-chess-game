import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';


function WorldChessMenu() {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        const fetchOpenings = async () => {
          try {
            const response = await axios.get('http://localhost:8080/chess/games');
            setGames(response.data);
            console.log(response.data);
          } catch (error) {
            setError(error);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchOpenings();
      }, []);

    return (
        <div>
            <Card className="text-center menu-strategy">
                <Card.Header as="h5">World Chess Games</Card.Header>
                <Card.Body style={{backgroundColor:"#1A1A1D"}}>
                    {isLoading ? (
                        <p>Loading games...</p>
                    ) : error ? (
                        <p>Error fetching games: {error.message}</p>
                    ) : (
                        <Container>
                            {games.map((game) => (
                                <Row key={game.id}>
                                    <Col>
                                        <Button variant="outline-light" style={{ marginBottom: '1rem', width: '30%' }}
                                        onClick={()=> navigate(`/world-chess-menu/${game.id}`)}>
                                            {game.title}
                                        </Button>
                                        <p style={{color:"white"}}>{game.date}</p>
                                    </Col>
                                </Row>
                            ))}
                        </Container>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default WorldChessMenu;