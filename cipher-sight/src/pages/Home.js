import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import codeIcon from '../assets/code.png';

function Home() {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <div className="desktop">
            <div className="window home-container">
                <div className="window-title">
                    <img src={codeIcon} alt="" className="title-icon" />
                    Cipher Sight
                    <div className="window-controls">
                        <button className="window-control">_</button>
                        <button className="window-control">□</button>
                        <button className="window-control">×</button>
                    </div>
                </div>

                <div className="window-content">
                    <div className="welcome-section">
                        <div className="app-header">
                            <img src={codeIcon} alt="Cipher Sight Icon" className="icon-large" />
                            <div className="app-info">
                                <h2 className="app-title">Cipher Sight</h2>
                                <p className="app-version">Version 1.0</p>
                                <p className="app-description">
                                    A visual representation for algorithms and data structures.
                                </p>
                            </div>
                        </div>

                        <div className="action-panel">
                            <div className="action-links">
                                <Link to="/algorithm" className="action-item">
                                    <div className="action-icon visualizer-icon"></div>
                                    <span>Launch Visualizer</span>
                                </Link>

                                <button
                                    className="action-item"
                                    onClick={() => setShowDialog(true)}
                                >
                                    <div className="action-icon features-icon"></div>
                                    <span>View Features</span>
                                </button>

                                <Link to="/help?algorithmName=defaultAlgorithm" className="action-item">
                                    <div className="action-icon help-icon"></div>
                                    <span>Help Topics</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="separator"></div>

                    <div className="quick-start">
                        <h3 className="section-header">Quick Start:</h3>
                        <ol className="quick-steps">
                            <li>Select a data structure from the dropdown</li>
                            <li>Choose an algorithm to visualize</li>
                            <li>Press Start to begin the visualization</li>
                            <li>Use controls to pause, resume, or reset</li>
                        </ol>
                    </div>
                </div>

                <div className="status-bar">
                    <div className="status-item">Ready</div>
                    <div className="status-item">Visualizer loaded</div>
                </div>
            </div>

            {showDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-window">
                        <div className="window-title">
                            Features
                            <div className="window-controls">
                                <button
                                    className="window-control"
                                    onClick={() => setShowDialog(false)}
                                >×</button>
                            </div>
                        </div>

                        <div className="dialog-content">
                            <div className="tab-panel">
                                <div className="tab active">Available Algorithms</div>
                                <div className="tab">Data Structures</div>
                            </div>

                            <div className="feature-list">
                                <div className="feature-category">
                                    <h4>Sorting Algorithms</h4>
                                    <ul>
                                        <li><span className="feature-item">Bubble Sort</span> - Simple comparison-based algorithm</li>
                                        <li><span className="feature-item">Quick Sort</span> - Efficient divide-and-conquer algorithm</li>
                                        <li><span className="feature-item">Merge Sort</span> - Stable divide-and-conquer algorithm</li>
                                        <li><span className="feature-item">Selection Sort</span> - In-place comparison algorithm</li>
                                        <li><span className="feature-item">Insertion Sort</span> - Simple sorting algorithm</li>
                                    </ul>
                                </div>

                                <div className="feature-category">
                                    <h4>Search Algorithms</h4>
                                    <ul>
                                        <li><span className="feature-item">Linear Search</span> - Sequential search algorithm</li>
                                        <li><span className="feature-item">Binary Search</span> - Efficient search for sorted arrays</li>
                                        <li><span className="feature-item">Breadth First Search</span> - Level-by-level graph traversal</li>
                                        <li><span className="feature-item">Depth First Search</span> - Path-based graph traversal</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="dialog-buttons">
                                <button
                                    className="button"
                                    onClick={() => setShowDialog(false)}
                                >OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;