import React from 'react';
import { useNavigate } from 'react-router-dom';
import errorIcon from '../assets/error.png';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page-container">
            <div className="window error-dialog">
                <div className="window-title">
                    CipherSight.exe - Error
                    <div className="window-controls">
                        <button className="window-control">×</button>
                    </div>
                </div>
                <div className="window-content error-content">
                    <div className="error-icon-container">
                        <img
                            src={errorIcon}
                            alt="Error Icon"
                            className="error-icon"
                        />
                        <div className="error-message">
                            <h2>404 - Page Not Found</h2>
                            <p className="technical-details">
                                * Press HOME to return to the home page.<br />
                                * Press RETRY to attempt loading the page again.<br />
                            </p>
                        </div>
                    </div>
                    <div className="button-group">
                        <button
                            className="button"
                            onClick={() => navigate('/')}
                        >
                            Home
                        </button>
                        <button
                            className="button"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ErrorPage;