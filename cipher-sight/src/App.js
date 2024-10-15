import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorPage from './components/ErrorPage';
import Home from './pages/Home';
import Algorithm from './pages/Algorithm';

import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/algorithm" element={<Algorithm />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  )
};

export default App;