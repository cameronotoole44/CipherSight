import React, { useState } from 'react';

const Controls = ({ onStart, onPause, onReset, onAlgorithmChange }) => {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');

    const handleAlgorithmChange = (e) => {
        setSelectedAlgorithm(e.target.value);
        onAlgorithmChange(e.target.value);
    };

    return (
        <div className='controls'>
            <select onChange={handleAlgorithmChange} value={selectedAlgorithm} className='control-select'>
                <option value="bubbleSort">Bubble Sort</option>
                <option value="quickSort">Quick Sort</option>
                <option value="mergeSort">Merge Sort</option>
                <option value="selectionSort">Selection Sort</option>

            </select>
            <button onClick={onStart} className='control-btn'>Start</button>
            <button onClick={onPause} className='control-btn'>Pause</button>
            <button onClick={onReset} className='control-btn'>Reset</button>
        </div>
    )
};

export default Controls;