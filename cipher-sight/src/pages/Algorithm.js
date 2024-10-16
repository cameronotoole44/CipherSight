import React, { useState, useEffect } from 'react';
import Controls from '../components/Controls';
import bubbleSort from '../algorithms/bubbleSort';
import quickSort from '../algorithms/quickSort';
import mergeSort from '../algorithms/mergeSort';
import insertionSort from '../algorithms/insertionSort';
import selectionSort from '../algorithms/selectionSort';
import { generateRandomArray } from '../utils/generateArray';

const Algorithm = () => {
    const [array, setArray] = useState([]);
    const [animationSpeed, setAnimationSpeed] = useState(100);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');

    useEffect(() => {
        resetArray();
    }, []);

    const resetArray = () => {
        setArray(generateRandomArray(50, 100)); // reset array to 50 elements
        setIsRunning(false);
    };

    const updateVisualizer = (newArray) => {
        setArray([...newArray]); // updates array state for visual
    };

    const handleAlgorithmChange = (algorithm) => {
        setSelectedAlgorithm(algorithm);
    };

    const startSort = async () => {
        setIsRunning(true);
        const sortingAlgorithms = {
            bubbleSort,
            quickSort,
            mergeSort,
            insertionSort,
            selectionSort
        };

        if (sortingAlgorithms[selectedAlgorithm]) {
            await sortingAlgorithms[selectedAlgorithm](array, updateVisualizer, animationSpeed);
        }

        setIsRunning(false);
    };

    const pauseSort = () => {

    };

    const resetSort = () => {
        resetArray(); // reset
    };

    return (
        <div className="algorithm-visualizer">
            <Controls
                onStart={startSort}
                onReset={resetSort}
                onAlgorithmChange={handleAlgorithmChange}
            />
            <div className="visualization">
                {array.map((value, idx) => (
                    <div
                        key={idx}
                        className="array-bar"
                        style={{ height: `${value}%` }}
                    />
                ))}
            </div>
        </div>
    )
};

export default Algorithm;
