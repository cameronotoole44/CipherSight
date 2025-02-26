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
import Controls from '../Controls';
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

            container
                .selectAll('.bar')
                .data(arr)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', (d, i) => i * barWidth + 1)
                .attr('y', (d) => height - (d / maxValue) * (height - 40))
                .attr('width', barWidth - 2)
                .attr('height', (d) => (d / maxValue) * (height - 40))
                .attr('fill', (d, i) => {
                    if (i === currentIndex && targetFound) return visualizerColors.found;
                    if (i === currentIndex) return visualizerColors.current;
                    if (visitedIndices.includes(i)) return visualizerColors.visited;
                    if (i >= leftBound && i <= rightBound) return visualizerColors.range;
                    return visualizerColors.default;
                })
                .attr('stroke', visualizerColors.border)
                .attr('stroke-width', 1);

            container
                .selectAll('text')
                .data(arr)
                .enter()
                .append('text')
                .attr('x', (d, i) => i * barWidth + barWidth / 2)
                .attr('y', height - 15)
                .attr('text-anchor', 'middle')
                .attr('fill', visualizerColors.text)
                .attr('font-size', '12px')
                .attr('font-family', 'MS Sans Serif, Arial, sans-serif')
                .text((d) => d);

            if (target !== null) {
                const targetBox = svg
                    .append('g')
                    .attr('transform', `translate(${width / 2 - 50}, 10)`);

                targetBox
                    .append('rect')
                    .attr('width', 100)
                    .attr('height', 25)
                    .attr('fill', visualizerColors.background)
                    .attr('stroke', visualizerColors.border)
                    .attr('stroke-width', 1);

                targetBox
                    .append('text')
                    .attr('x', 50)
                    .attr('y', 17)
                    .attr('text-anchor', 'middle')
                    .attr('fill', visualizerColors.text)
                    .attr('font-family', 'MS Sans Serif, Arial, sans-serif')
                    .attr('font-size', '12px')
                    .text(`Target: ${target}`);
            }
        },
        [target]
    );

    const initializeData = useCallback(() => {
        if (isInitialized) return;

        if (!['bfs', 'dfs'].includes(selectedAlgorithm) || selectedDataStructure !== 'graph') {
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
            if (selectedDataStructure === 'graph' && ['bfs', 'dfs'].includes(selectedAlgorithm)) {
                if (graphVisualizerRef.current) {
                    graphVisualizerRef.current.startVisualization();
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
                        if (target === null) {
                            throw new Error('No target value set for binary search');
                        }
                        result = await binarySearch([...array], target, drawArray);
                        break;
                    }
                    case 'linearSearch': {
                        if (target === null) {
                            throw new Error('No target value set for linear search');
                        }
                        result = await linearSearch([...array], target, drawArray);
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
                return ['bfs', 'dfs'].includes(selectedAlgorithm) ? (
                    <GraphVisualizer
                        ref={graphVisualizerRef}
                        algorithm={selectedAlgorithm}
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
            <h1>Algorithm Visualizer</h1>

            <div className="visualization-controls">
                <div className="data-structure-selector">
                    <label>Data Structure:</label>
                    <select
                        value={selectedDataStructure}
                        onChange={(e) => handleDataStructureChange(e.target.value)}
                        disabled={isRunning}
                    >
                        <option value="array">Array</option>
                        <option value="graph">Graph</option>
                        <option value="linkedList">Linked List</option>
                    </select>
                </div>
            </div>

            <div className="visualization">
                {renderVisualizer()}

                <Controls
                    selectedAlgorithm={selectedAlgorithm}
                    onAlgorithmChange={handleAlgorithmChange}
                    isRunning={isRunning}
                    paused={paused}
                    onStart={runAlgorithm}
                    onPause={handlePause}
                    onResume={handleResume}
                    onReset={handleReset}
                />

                <Link
                    to={`/help?algorithmName=${selectedAlgorithm}`}
                    className="button help-button"
                >
                    Help
                </Link>
            </div>
        </div>
    );
};

export default AlgorithmVisualizer;