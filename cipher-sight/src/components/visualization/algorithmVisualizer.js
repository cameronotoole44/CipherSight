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
import bfs from '../../algorithms/search/breadthFirstSearch';
import dfs from '../../algorithms/search/depthFirstSearch';
import Controls from '../Controls';
import { generateRandomArray } from '../../utils/generateArray';
import { generateRandomGraph } from '../../utils/generateGraph';

const AlgorithmVisualizer = () => {
    const [array, setArray] = useState([]);
    const [graph, setGraph] = useState(null);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');
    const [isRunning, setIsRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [target, setTarget] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const svgRef = useRef(null);
    const mermaidRef = useRef(null);
    const sortingRef = useRef({
        isPaused: false,
        shouldStop: false,
    });

    const animationSpeed = 1000;

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
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

    const drawGraphWithMermaid = useCallback(async (graph, currentNode = null, edgesVisited = new Set(), visitOrder = []) => {
        if (!mermaidRef.current) return;

        const graphDescription = `
            graph TD
            ${graph.nodes.map((node) => `${node.id}["${node.label || node.id}"]`).join('\n')}
            ${graph.links
                .map((link) => {
                    const visited = edgesVisited.has(`${link.source.id}-${link.target.id}`) || edgesVisited.has(`${link.target.id}-${link.source.id}`);
                    return `${link.source.id} --> |${visited ? 'Visited' : ''}| ${link.target.id}`;
                })
                .join('\n')}
        `;

        try {
            mermaid.mermaidAPI.render('graphDiv', graphDescription, (svgCode) => {
                if (mermaidRef.current) {
                    mermaidRef.current.innerHTML = svgCode;

                    if (currentNode) {
                        const currentNodeElement = mermaidRef.current.querySelector(`[id*="${currentNode.id}"]`);
                        if (currentNodeElement) {
                            currentNodeElement.style.fill = '#FDFEC9';
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error rendering Mermaid graph:', error);
        }
    }, []);

    const initializeData = useCallback(() => {
        if (isInitialized) return;

        if (['bfs', 'dfs'].includes(selectedAlgorithm)) {
            const newGraph = generateRandomGraph(10, 0.3);
            setGraph(newGraph);
            drawGraphWithMermaid(newGraph);
        } else {
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
    }, [selectedAlgorithm, drawArray, drawGraphWithMermaid, isInitialized]);

    const runAlgorithm = async () => {
        if (isRunning) return;

        sortingRef.current.isPaused = false;
        sortingRef.current.shouldStop = false;
        setIsRunning(true);

        try {
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
                case 'bfs':
                case 'dfs': {
                    const searchFunction = selectedAlgorithm === 'bfs' ? bfs : dfs;
                    result = await searchFunction(graph, drawGraphWithMermaid, animationSpeed);
                    break;
                }
                default:
                    throw new Error(`Unknown algorithm: ${selectedAlgorithm}`);
            }

            console.log(`Algorithm ${selectedAlgorithm} completed:`, result);
        } catch (error) {
            console.error('Error running algorithm:', error);
        } finally {
            setIsRunning(false);
            setPaused(false);
        }
    };

    const handlePause = () => {
        setPaused(true);
        sortingRef.current.isPaused = true;
    };

    const handleResume = () => {
        setPaused(false);
        sortingRef.current.isPaused = false;
    };

    const handleReset = useCallback(() => {
        sortingRef.current.shouldStop = true;
        sortingRef.current.isPaused = false;
        setIsRunning(false);
        setPaused(false);
        setIsInitialized(false);
        initializeData();
    }, [initializeData]);

    const handleAlgorithmChange = (newAlgorithm) => {
        setSelectedAlgorithm(newAlgorithm);
        setIsInitialized(false);
    };

    useEffect(() => {
        initializeData();
    }, [initializeData]);

    return (
        <div className="visualization-container">
            <h1>Algorithm Visualizer</h1>
            <div className="visualization">
                {['bfs', 'dfs'].includes(selectedAlgorithm) ? (
                    <div
                        id="mermaid-svg-container"
                        ref={mermaidRef}
                        className="visualization-graph"
                    ></div>
                ) : (
                    <svg
                        ref={svgRef}
                        width="600"
                        height="400"
                        className="visualization-array"
                    ></svg>
                )}
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
