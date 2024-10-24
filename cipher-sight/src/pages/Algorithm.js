import React, { useState, useEffect, useRef } from 'react';
import Controls from '../components/Controls';
import bubbleSort from '../algorithms/sort/bubbleSort';
import quickSort from '../algorithms/sort/quickSort';
import mergeSort from '../algorithms/sort/mergeSort';
import insertionSort from '../algorithms/sort/insertionSort';
import selectionSort from '../algorithms/sort/selectionSort';
import { generateRandomArray } from '../utils/generateArray';
import AlgorithmDescription from '../algorithms/algorithmDescription';

const Algorithm = () => {
    const [array, setArray] = useState([]);
    const [animationSpeed, setAnimationSpeed] = useState(100);
    const [isRunning, setIsRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');

    const sortingRef = useRef({
        isPaused: false,
        shouldStop: false,
    });

    useEffect(() => {
        resetArray();
    }, []);

    const resetArray = () => {
        setArray(generateRandomArray(50, 100));
        setIsRunning(false);
        setPaused(false);
        sortingRef.current.shouldStop = true; // stops on reset
    };

    const updateVisualizer = (newArray) => {
        setArray([...newArray]); // re-render
    };

    const runAlgorithm = async () => {
        const sortingAlgorithms = { bubbleSort, quickSort, mergeSort, insertionSort, selectionSort };
        const algorithm = sortingAlgorithms[selectedAlgorithm];

        sortingRef.current.isPaused = false;
        sortingRef.current.shouldStop = false;

        setIsRunning(true);
        setPaused(false);

        await algorithm(array, updateVisualizer, animationSpeed, sortingRef);

        setIsRunning(false);
    };

    const startAlgorithm = async () => {
        if (!isRunning) {
            runAlgorithm();
        }
    };

    // sets pause state
    const pauseAlgorithm = () => {
        setPaused(true);
        sortingRef.current.isPaused = true;
    };

    // resume sorting
    const resumeAlgorithm = () => {
        setPaused(false);
        sortingRef.current.isPaused = false;
    };

    return (
        <div className="algorithm-visualizer">
            <Controls
                onStart={startAlgorithm}
                onPause={pauseAlgorithm}
                onResume={resumeAlgorithm}
                onReset={resetArray}
                onAlgorithmChange={setSelectedAlgorithm}
                selectedAlgorithm={selectedAlgorithm}
            />
            <div className="visualization">
                {array.map((value, idx) => (
                    <div key={idx} className="array-bar" style={{ height: `${value}%` }} />
                ))}
            </div>
            <AlgorithmDescription algorithmName={selectedAlgorithm} />
        </div>
    )
};

export default Algorithm;