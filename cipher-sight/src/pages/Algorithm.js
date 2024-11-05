import React, { useState, useEffect, useRef } from 'react';
import Controls from '../components/Controls';
import bubbleSort from '../algorithms/sort/bubbleSort';
import quickSort from '../algorithms/sort/quickSort';
import mergeSort from '../algorithms/sort/mergeSort';
import insertionSort from '../algorithms/sort/insertionSort';
import selectionSort from '../algorithms/sort/selectionSort';
import binarySearch from '../algorithms/search/binarySearch';
import linearSearch from '../algorithms/search/linearSearch';
import bfs from '../algorithms/search/breadthFirstSearch';
import dfs from '../algorithms/search/depthFirstSearch';
import { generateRandomArray } from '../utils/generateArray';
import { generateRandomGraph } from '../utils/generateGraph';
import AlgorithmDescription from '../algorithms/algorithmDescription';

const Algorithm = () => {
    const [array, setArray] = useState([]);
    const [graph, setGraph] = useState(null);
    const [animationSpeed, setAnimationSpeed] = useState(100);
    const [isRunning, setIsRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [searchTarget, setSearchTarget] = useState(50);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');

    const sortingRef = useRef({
        isPaused: false,
        shouldStop: false,
    });

    // initialize the array/graph based on the selected algorithm
    useEffect(() => {
        resetData();
    }, [selectedAlgorithm]);

    const resetData = () => {
        sortingRef.current.shouldStop = true;
        setIsRunning(false);
        setPaused(false);

        if (['bfs', 'dfs'].includes(selectedAlgorithm)) {
            const newGraph = generateRandomGraph(10, 0.3);
            setGraph(newGraph);
            setArray([]);
        } else {
            const newArray = generateRandomArray(50, 100);
            setArray(newArray.map(n => Number(n)));
            setGraph(null);
        }
    };

    const updateVisualizer = (data) => {
        if (Array.isArray(data)) {
            setArray(data.map(value => ({
                value: Number(value),
                isHighlighted: false,
                isVisited: false,
                isFound: false,
                isBound: false
            })));
        } else if (data.type === 'search') {
            setArray(array.map((item, index) => ({
                value: typeof item === 'object' ? item.value : Number(item),
                isHighlighted: index === data.currentIndex,
                isVisited: data.visitedIndices?.includes(index),
                isFound: index === data.currentIndex && data.found,
                isBound: data.leftBound === index || data.rightBound === index
            })));
        }
    };

    const runAlgorithm = async () => {
        sortingRef.current.isPaused = false;
        sortingRef.current.shouldStop = false;
        setIsRunning(true);
        setPaused(false);

        try {
            const simpleArray = array.map(item => (typeof item === 'object' ? item.value : Number(item)));

            if (['bubbleSort', 'quickSort', 'mergeSort', 'insertionSort', 'selectionSort'].includes(selectedAlgorithm)) {
                await {
                    bubbleSort,
                    quickSort,
                    mergeSort,
                    insertionSort,
                    selectionSort,
                }[selectedAlgorithm](simpleArray, updateVisualizer, animationSpeed, sortingRef);
            } else if (selectedAlgorithm === 'binarySearch') {
                const sortedArray = [...simpleArray].sort((a, b) => a - b);
                setArray(sortedArray.map(value => ({ value, isHighlighted: false })));
                await binarySearch(sortedArray, data => updateVisualizer({ ...data, type: 'search' }), animationSpeed, searchTarget);
            } else if (selectedAlgorithm === 'linearSearch') {
                await linearSearch(simpleArray, data => updateVisualizer({ ...data, type: 'search' }), animationSpeed, searchTarget);
            }
        } catch (error) {
            console.error("Error during algorithm execution:", error);
        } finally {
            setIsRunning(false);
        }
    };

    const startAlgorithm = () => {
        if (!isRunning) {
            runAlgorithm();
        }
    };

    const pauseAlgorithm = () => {
        setPaused(true);
        sortingRef.current.isPaused = true;
    };

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
                onReset={resetData}
                onAlgorithmChange={setSelectedAlgorithm}
                selectedAlgorithm={selectedAlgorithm}
            />
            {['binarySearch', 'linearSearch'].includes(selectedAlgorithm) && (
                <div className="search-controls">
                    <label>
                        Search Target:
                        <input
                            type="number"
                            value={searchTarget}
                            onChange={(e) => setSearchTarget(Number(e.target.value))}
                            min="1"
                            max="100"
                        />
                    </label>
                </div>
            )}
            <div className="visualization">
                {array.length > 0 && array.map((item, idx) => (
                    <div
                        key={idx}
                        className={`array-bar ${item.isHighlighted ? 'highlighted' : ''}
                                              ${item.isVisited ? 'visited' : ''}
                                              ${item.isFound ? 'found' : ''}
                                              ${item.isBound ? 'bound' : ''}`}
                        style={{
                            height: `${typeof item === 'object' ? item.value : item}%`,
                            backgroundColor: item.isFound ? '#4CAF50' :
                                item.isHighlighted ? '#FF4081' :
                                    item.isVisited ? '#FFA726' :
                                        '#2196F3'
                        }}
                    />
                ))}
            </div>
            <AlgorithmDescription algorithmName={selectedAlgorithm} />
        </div>
    )
};

export default Algorithm;