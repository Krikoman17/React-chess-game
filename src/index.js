import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import App from './App';
import Home from './Home';
import MenuStrategy from './menuStrategy';
import StrategyBoard from './strategyBoard';
import WorldChessMenu from './worldChessMenu';
import FideGames from './fideGames';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<App />} />
        <Route path="/strategies" element={<MenuStrategy />} />
        <Route path="/strategies/:id" element={<StrategyBoard />} />
        <Route path="/world-chess-menu" element={<WorldChessMenu />} />
        <Route path="/world-chess-menu/:id" element={<FideGames />} />
      </Routes>
    </Router>
  </React.StrictMode>
);


