import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import mermaid from 'mermaid';

import bubbleSort from '../../algorithms/sort/bubbleSort';
import quickSort from '../../algorithms/sort/quickSort';
import mergeSort from '../../algorithms/sort/mergeSort';
import insertionSort from '../../algorithms/sort/insertionSort';
import selectionSort from '../../algorithms/sort/selectionSort';
import binarySearch from '../../algorithms/search/binarySearch';
import linearSearch from '../../algorithms/search/linearSearch';
import { generateRandomArray } from '../../utils/generateArray';
import GraphVisualizer from './GraphVisualizer';
import LinkedListVisualizer from './LinkedListVisualizer';

const AlgorithmVisualizer = () => {
    const [array, setArray] = useState([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');
    const [selectedDataStructure, setSelectedDataStructure] = useState('array');

    const [isRunning, setIsRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [target, setTarget] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const svgRef = useRef(null);
    const graphVisualizerRef = useRef(null);
    const sortingRef = useRef({
        isPaused: false,
        shouldStop: false,
    });

    const animationSpeed = 1000;

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: 'default',
        });
    }, []);

    const drawArray = useCallback(
        (arr, currentIndex = -1, visitedIndices = [], targetFound = false, leftBound = 0, rightBound = arr.length - 1) => {
            if (!svgRef.current) return;

            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();

            const width = 600;
            const height = 400;
            const barWidth = width / arr.length;
            const maxValue = Math.max(...arr);

            const visualizerColors = {
                background: '#C0C0C0',
                default: '#C3C7CB',
                current: '#FDFEC9',
                found: '#00A800',
                visited: '#808080',
                range: '#008081',
                text: '#000',
                border: '#87888F',
            };

            const container = svg.append('g').attr('transform', `translate(0, 0)`);
            container
                .append('rect')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', visualizerColors.background);

            const isSearchAlgorithm = ['binarySearch', 'linearSearch'].includes(selectedAlgorithm);

            if (isSearchAlgorithm && target !== null) {
                const targetBox = svg
                    .append('g')
                    .attr('transform', `translate(10, 10)`);

                targetBox
                    .append('rect')
                    .attr('width', 120)
                    .attr('height', 25)
                    .attr('fill', visualizerColors.background)
                    .attr('stroke', visualizerColors.border)
                    .attr('stroke-width', 1);

                targetBox
                    .append('text')
                    .attr('x', 10)
                    .attr('y', 17)
                    .attr('text-anchor', 'start')
                    .attr('fill', visualizerColors.text)
                    .attr('font-family', 'MS Sans Serif, Arial, sans-serif')
                    .attr('font-size', '12px')
                    .text(`Target: ${target}`);

                const metrics = svg
                    .append('g')
                    .attr('transform', `translate(${width - 120}, 10)`);

                metrics
                    .append('rect')
                    .attr('width', 110)
                    .attr('height', 40)
                    .attr('fill', visualizerColors.background)
                    .attr('stroke', visualizerColors.border)
                    .attr('stroke-width', 1);

                metrics
                    .append('text')
                    .attr('x', 55)
                    .attr('y', 17)
                    .attr('text-anchor', 'middle')
                    .attr('fill', visualizerColors.text)
                    .attr('font-family', 'MS Sans Serif, Arial, sans-serif')
                    .attr('font-size', '11px')
                    .text(`Steps: ${visitedIndices.length}`);

                metrics
                    .append('text')
                    .attr('x', 55)
                    .attr('y', 32)
                    .attr('text-anchor', 'middle')
                    .attr('fill', visualizerColors.text)
                    .attr('font-family', 'MS Sans Serif, Arial, sans-serif')
                    .attr('font-size', '11px')
                    .text(`Comparisons: ${visitedIndices.length}`);
            }

            const usableHeight = isSearchAlgorithm ? height - 60 : height - 40;

            container
                .selectAll('.bar')
                .data(arr)
                .enter()
                .append('rect')
                .attr('class', (d, i) => {
                    let classes = 'bar';
                    if (i === currentIndex && targetFound) classes += ' found';
                    else if (i === currentIndex) classes += ' current';
                    else if (visitedIndices.includes(i)) classes += ' visited';
                    else if (isSearchAlgorithm && i >= leftBound && i <= rightBound) classes += ' in-range';
                    else if (isSearchAlgorithm) classes += ' out-of-range';
                    return classes;
                })
                .attr('x', (d, i) => i * barWidth + 1)
                .attr('y', (d) => height - (d / maxValue) * usableHeight)
                .attr('width', barWidth - 2)
                .attr('height', (d) => (d / maxValue) * usableHeight)
                .attr('fill', visualizerColors.default)
                .attr('stroke', visualizerColors.border)
                .attr('stroke-width', 1);
            container
                .selectAll('text.value')
                .data(arr)
                .enter()
                .append('text')
                .attr('class', 'value')
                .attr('x', (d, i) => i * barWidth + barWidth / 2)
                .attr('y', height - 15)
                .attr('text-anchor', 'middle')
                .attr('fill', visualizerColors.text)
                .attr('font-size', '12px')
                .attr('font-family', 'MS Sans Serif, Arial, sans-serif')
                .text((d) => d);

            container
                .selectAll('text.index')
                .data(arr)
                .enter()
                .append('text')
                .attr('class', 'index')
                .attr('x', (d, i) => i * barWidth + barWidth / 2)
                .attr('y', height - 2)
                .attr('text-anchor', 'middle')
                .attr('fill', visualizerColors.text)
                .attr('font-size', '10px')
                .attr('font-family', 'MS Sans Serif, Arial, sans-serif')
                .text((d, i) => i);
        },
        [target, selectedAlgorithm]
    );

    const initializeData = useCallback(() => {
        if (isInitialized) return;

        if (!['breadthFirstSearch', 'depthFirstSearch'].includes(selectedAlgorithm) || selectedDataStructure !== 'graph') {
            let newArray = generateRandomArray(20);

            if (selectedAlgorithm === 'binarySearch') {
                newArray.sort((a, b) => a - b);
            }

            if (['binarySearch', 'linearSearch'].includes(selectedAlgorithm)) {
                const randomTarget = newArray[Math.floor(Math.random() * newArray.length)];
                setTarget(randomTarget);
            } else {
                setTarget(null);
            }

            setArray(newArray);
            drawArray(newArray);
        }

        setIsInitialized(true);
    }, [selectedAlgorithm, selectedDataStructure, drawArray, isInitialized]);

    const runAlgorithm = async () => {
        if (isRunning) return;

        sortingRef.current.isPaused = false;
        sortingRef.current.shouldStop = false;
        setIsRunning(true);

        try {
            if (selectedDataStructure === 'graph' && ['breadthFirstSearch', 'depthFirstSearch'].includes(selectedAlgorithm)) {
                if (graphVisualizerRef.current) {
                    const graphAlgorithm = selectedAlgorithm === 'breadthFirstSearch' ? 'bfs' : 'dfs';
                    graphVisualizerRef.current.startVisualization(graphAlgorithm);
                }
            } else {
                let result;
                switch (selectedAlgorithm) {
                    case 'bubbleSort':
                    case 'quickSort':
                    case 'mergeSort':
                    case 'insertionSort':
                    case 'selectionSort': {
                        const sortFunction = {
                            bubbleSort,
                            quickSort,
                            mergeSort,
                            insertionSort,
                            selectionSort,
                        }[selectedAlgorithm];

                        result = await sortFunction([...array], drawArray, animationSpeed, sortingRef);
                        break;
                    }
                    case 'binarySearch': {
                        result = await binarySearch([...array], target, drawArray, sortingRef, animationSpeed);
                        break;
                    }
                    case 'linearSearch': {
                        result = await linearSearch([...array], target, drawArray, sortingRef, animationSpeed);
                        break;
                    }
                    default:
                        throw new Error(`Unknown algorithm: ${selectedAlgorithm}`);
                }
            }
        } catch (error) {
            console.error('Error running algorithm:', error);
        } finally {
            if (selectedDataStructure !== 'graph') {
                setIsRunning(false);
                setPaused(false);
            }
        }
    };

    const handlePause = () => {
        setPaused(true);

        if (selectedDataStructure === 'graph' && graphVisualizerRef.current) {
            graphVisualizerRef.current.pauseVisualization();
        } else {
            sortingRef.current.isPaused = true;
        }
    };

    const handleResume = () => {
        setPaused(false);

        if (selectedDataStructure === 'graph' && graphVisualizerRef.current) {
            graphVisualizerRef.current.resumeVisualization();
        } else {
            sortingRef.current.isPaused = false;
        }
    };

    const handleReset = useCallback(() => {
        if (selectedDataStructure === 'graph' && graphVisualizerRef.current) {
            graphVisualizerRef.current.resetVisualization();
        } else {
            sortingRef.current.shouldStop = true;
            sortingRef.current.isPaused = false;
        }

        setIsRunning(false);
        setPaused(false);
        setIsInitialized(false);
        initializeData();
    }, [initializeData, selectedDataStructure]);

    const handleAlgorithmChange = (newAlgorithm) => {
        setSelectedAlgorithm(newAlgorithm);
        setIsInitialized(false);
    };

    const handleDataStructureChange = (newDataStructure) => {
        setSelectedDataStructure(newDataStructure);
        setIsInitialized(false);
    };

    useEffect(() => {
        initializeData();
    }, [initializeData]);

    const renderVisualizer = () => {
        switch (selectedDataStructure) {
            case 'array':
                return (
                    <svg
                        ref={svgRef}
                        width="600"
                        height="400"
                        className="visualization-array"
                    ></svg>
                );
            case 'graph':
                return ['breadthFirstSearch', 'depthFirstSearch'].includes(selectedAlgorithm) ? (
                    <GraphVisualizer
                        ref={graphVisualizerRef}
                        algorithm={selectedAlgorithm === 'breadthFirstSearch' ? 'bfs' : 'dfs'}
                        animationSpeed={animationSpeed}
                    />
                ) : (
                    <div className="visualization-message" style={{
                        padding: '20px',
                        backgroundColor: '#C0C0C0',
                        border: 'solid 2px',
                        borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
                        fontFamily: "'MS Sans Serif', Arial, sans-serif",
                        fontSize: '11px',
                        textAlign: 'center'
                    }}>
                        Please select BFS or DFS algorithm for graph visualization
                    </div>
                );
            case 'linkedList':
                return <LinkedListVisualizer />;
            default:
                return <div>Select a data structure to visualize</div>;
        }
    };

    return (
        <div className="visualization-container">
            <div className="visualization-title">
                <span>Algorithm Visualizer</span>
                <div className="window-controls">
                    <button className="window-button">_</button>
                    <button className="window-button">□</button>
                    <button className="window-button">×</button>
                </div>
            </div>

            <div className="select-container">
                <label>Data Structure:</label>
                <select
                    className="data-structure-select"
                    value={selectedDataStructure}
                    onChange={(e) => handleDataStructureChange(e.target.value)}
                    disabled={isRunning}
                >
                    <option value="array">Array</option>
                    <option value="graph">Graph</option>
                    <option value="linkedList">Linked List</option>
                </select>
            </div>

            <div className="visualization">
                {renderVisualizer()}

                <div className="select-container">
                    <select
                        className="algorithm-select"
                        value={selectedAlgorithm}
                        onChange={(e) => handleAlgorithmChange(e.target.value)}
                        disabled={isRunning}
                    >
                        <option value="bubbleSort">Bubble Sort</option>
                        <option value="quickSort">Quick Sort</option>
                        <option value="mergeSort">Merge Sort</option>
                        <option value="selectionSort">Selection Sort</option>
                        <option value="insertionSort">Insertion Sort</option>
                        <option value="binarySearch">Binary Search</option>
                        <option value="linearSearch">Linear Search</option>
                        <option value="breadthFirstSearch">Breadth First Search</option>
                        <option value="depthFirstSearch">Depth First Search</option>
                    </select>
                </div>

                <div className="controls-container">
                    <button
                        className={`control-button ${isRunning && !paused ? 'disabled' : ''}`}
                        onClick={runAlgorithm}
                        disabled={isRunning && !paused}
                    >
                        <span className="button-icon start-icon"></span>
                        Start
                    </button>
                    <button
                        className={`control-button ${!isRunning || paused ? 'disabled' : ''}`}
                        onClick={handlePause}
                        disabled={!isRunning || paused}
                    >
                        <span className="button-icon pause-icon"></span>
                        Pause
                    </button>
                    <button
                        className={`control-button ${!paused ? 'disabled' : ''}`}
                        onClick={handleResume}
                        disabled={!paused}
                    >
                        <span className="button-icon resume-icon"></span>
                        Resume
                    </button>
                    <button
                        className="control-button"
                        onClick={handleReset}
                    >
                        <span className="button-icon reset-icon"></span>
                        Reset
                    </button>
                </div>

                <Link
                    to={`/help?algorithmName=${selectedAlgorithm}`}
                    className="control-button help-button"
                >
                    Help
                </Link>
            </div>

            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <linearGradient id="bar-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00AEAE" />
                        <stop offset="100%" stopColor="#006363" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default AlgorithmVisualizer;