import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap'; // Import components
import './styles.css'; // Import Bootstrap styles
import { useNavigate } from 'react-router-dom';

function MenuStrategy() {
  const [openings, setOpenings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchOpenings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/openings');
        setOpenings(response.data);
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
    <Card className="text-center menu-strategy">
        <Card.Header as="h5">My Openings</Card.Header>
        <Card.Body style={{backgroundColor:"#1A1A1D"}}>
            {isLoading ? (
                <p>Loading openings...</p>
            ) : error ? (
                <p>Error fetching openings: {error.message}</p>
            ) : (
                <Container>
                    {openings.map((opening) => (
                        <Row key={opening.id}>
                            <Col>
                                <Button variant="outline-light" style={{ marginBottom: '1rem', width: '30%' }}
                                onClick={()=> navigate(`/strategies/${opening.id}`)}>
                                    {opening.name}
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </Container>
            )}
        </Card.Body>
    </Card>
);
}

export default MenuStrategy;
