import React from 'react';

const Controls = ({ onStart, onPause, onReset }) => {
    return (
        <div className='controls'>
            <button onClick={onStart} className='control-btn'>Start</button>
            <button onClick={onPause} className='control-btn'>Pause</button>
            <button onClick={onReset} className='control-btn'>Reset</button>
        </div>
    )
};

export default Controls;