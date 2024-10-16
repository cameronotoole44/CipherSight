import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Controls from '../components/Controls';
import Visualizer from '../components/visualization/algorithmVisualizer';
import bubbleSort from '../algorithms/bubbleSort';
import quickSort from '../algorithms/quickSort';
import mergeSort from '../algorithms/mergeSort';
import selectionSort from '../algorithms/selectionSort';

const Algorithm = () => {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(bubbleSort);

    const handleStart = () => {
        console.log('Start clicked');
    };

    const handlePause = () => {
        console.log('Pause clicked');
    };

    const handleReset = () => {
        console.log('Reset clicked');
    };

    const handleAlgorithmChange = (algorithmName) => {

        const algorithms = {
            bubbleSort,
            quickSort,
            mergeSort,
            selectionSort,
        };
        setSelectedAlgorithm(algorithms[algorithmName]);
    };

    return (
        <div>
            <Navbar />
            <Visualizer
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
                algorithm={selectedAlgorithm}
            />
            <Controls
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
                onAlgorithmChange={handleAlgorithmChange}
            />
        </div>
    )
};

export default Algorithm;