import React from 'react';
import { Link } from 'react-router-dom';
import codeIcon from '../assets/code.png';

function Home() {
    return (
        <div className="window home-container">
            <div className="window-title">
                Welcome to Cipher Sight
                <div className="window-controls">
                    <button className="window-control">_</button>
                    <button className="window-control">□</button>
                    <button className="window-control">×</button>
                </div>
            </div>
            <div className="window-content">
                <div className="icon-container">
                    <img
                        src={codeIcon}
                        alt="Cipher Sight Icon"
                        className="icon"
                    />
                    <span>Cipher Sight.exe</span>
                </div>

                <div className="welcome-text">
                    <h2>Welcome!</h2>
                    <p>A visual representation for algorithms and data types.</p>
                </div>

                <div className="button-group">
                    <Link to="/algorithm" className="button">
                        Launch Visualizer
                    </Link>
                </div>

                <div className="features">
                    <h3>Features:</h3>
                    <ul>
                        <li>Sorting Algorithms Visualization</li>
                        <li>Search Algorithms Visualization</li>
                        <li>Interactive Controls</li>
                    </ul>
                </div>
            </div>
            <div className="status-bar">
                Ready
            </div>
        </div>
    )
};

export default Home;