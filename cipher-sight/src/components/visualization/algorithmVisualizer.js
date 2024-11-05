import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import bubbleSort from '../../algorithms/sort/bubbleSort';
import quickSort from '../../algorithms/sort/quickSort';
import mergeSort from '../../algorithms/sort/mergeSort';
import insertionSort from '../../algorithms/sort/insertionSort';
import selectionSort from '../../algorithms/sort/selectionSort';
import binarySearch from '../../algorithms/search/binarySearch';
import linearSearch from '../../algorithms/search/linearSearch';
import bfs from '../../algorithms/search/bfs';
import dfs from '../../algorithms/search/dfs';
import Controls from '../Controls';
import { generateRandomArray } from '../../utils/generateArray';
import { generateRandomGraph } from '../../utils/generateGraph';

const AlgorithmVisualizer = () => {
    const [array, setArray] = useState([]);
    const [graph, setGraph] = useState(null);
    const svgRef = useRef(null);
    const [animationSpeed] = useState(500);
    const [isRunning, setIsRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');

    const sortingRef = useRef({
        isPaused: false,
        shouldStop: false,
    });

    const initializeData = useCallback(() => {
        if (['bfs', 'dfs'].includes(selectedAlgorithm)) {
            const newGraph = generateRandomGraph(10, 0.3);
            setGraph(newGraph);
            drawGraph(newGraph);
        } else {
            const newArray = generateRandomArray(20);
            setArray(newArray);
            drawArray(newArray);
        }
    }, [selectedAlgorithm]);

    // draw array
    const drawArray = (arr) => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();  // clear previous svg

        const width = 600;
        const height = 400;
        const barWidth = width / arr.length;

        svg.selectAll("rect")
            .data(arr)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * barWidth)
            .attr("y", d => height - (d / 100) * height)
            .attr("width", barWidth - 2)
            .attr("height", d => (d / 100) * height)
            .attr("class", "array-bar");
    };

    // draw graph (dfs, and bfs)
    const drawGraph = (graphData) => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 400;

        const simulation = d3.forceSimulation(graphData.nodes)
            .force("link", d3.forceLink(graphData.links).distance(100))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2));

        svg.selectAll("line")
            .data(graphData.links)
            .enter()
            .append("line")
            .attr("stroke", "#999");

        const node = svg.selectAll("circle")
            .data(graphData.nodes)
            .enter()
            .append("circle")
            .attr("r", 10)
            .attr("fill", "#69b3a2");

        simulation.on("tick", () => {
            svg.selectAll("line")
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });
    };

    const runAlgorithm = async () => {
        const arrayCopy = [...array];
        sortingRef.current.isPaused = false;
        sortingRef.current.shouldStop = false;

        setIsRunning(true);
        setPaused(false);

        try {
            if (['bubbleSort', 'quickSort', 'mergeSort', 'insertionSort', 'selectionSort'].includes(selectedAlgorithm)) {
                await {
                    bubbleSort,
                    quickSort,
                    mergeSort,
                    insertionSort,
                    selectionSort
                }[selectedAlgorithm](arrayCopy, drawArray, animationSpeed, sortingRef);
            } else if (selectedAlgorithm === 'binarySearch') {
                await binarySearch(arrayCopy, drawArray, animationSpeed);
            } else if (selectedAlgorithm === 'linearSearch') {
                await linearSearch(arrayCopy, drawArray, animationSpeed);
            } else if (selectedAlgorithm === 'bfs') {
                await bfs(graph, drawGraph, animationSpeed);
            } else if (selectedAlgorithm === 'dfs') {
                await dfs(graph, drawGraph, animationSpeed);
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

    const handlePause = () => {
        setPaused(true);
        sortingRef.current.isPaused = true;
    };

    const handleResume = () => {
        setPaused(false);
        sortingRef.current.isPaused = false;
    };

    const handleReset = () => {
        sortingRef.current.shouldStop = true;
        sortingRef.current.isPaused = false;
        setIsRunning(false);
        setPaused(false);

        setTimeout(() => {
            initializeData();
            sortingRef.current.shouldStop = false;
        }, 100);  // delay length
    };

    useEffect(() => {
        initializeData();
    }, [initializeData]);

    return (
        <div className="visualization-container">
            <h1>Algorithm Visualizer</h1>
            <div className="visualization">
                <svg ref={svgRef} width="600" height="400" />
                <Controls
                    selectedAlgorithm={selectedAlgorithm}
                    setSelectedAlgorithm={setSelectedAlgorithm}
                    isRunning={isRunning}
                    paused={paused}
                    onStart={startAlgorithm}
                    onPause={handlePause}
                    onResume={handleResume}
                    onReset={handleReset}
                />
            </div>
        </div>
    )
};

export default AlgorithmVisualizer;