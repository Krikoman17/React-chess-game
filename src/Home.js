import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import {useNavigate} from 'react-router-dom';

function Home() {
    let navigate = useNavigate();
    function handleClick() {
        navigate('/app');
        
    }
    function handleClick2() {
        navigate('/strategies');
    }

    return (
        <div style={{height:"100%"}}>
            <h1>Welcome to the Chess game</h1>
            <div style={{display: 'flex', justifyContent:'center',alignItems:'center',height:"100%" }}>
            <Button variant="primary" onClick={handleClick} style={{marginRight:"50px"}}>New Game</Button>
            <Button variant="primary" onClick={handleClick2}>Strategies</Button>
            </div>
        </div>
    );
}

export default Home;    