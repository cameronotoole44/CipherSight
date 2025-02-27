import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorPage from './pages/Error';
import Home from './pages/Home';
import AlgorithmVisualizer from './components/visualization/algorithmVisualizer';
import AlgorithmDescription from './algorithms/algorithmDescription';

import './components/styles/index.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/algorithm" element={<AlgorithmVisualizer />} />
        <Route path="/help" element={<AlgorithmDescription />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  )
};

export default App;