import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import bubbleSort from '../../algorithms/sort/bubbleSort';
import quickSort from '../../algorithms/sort/quickSort';
import mergeSort from '../../algorithms/sort/mergeSort';
import insertionSort from '../../algorithms/sort/insertionSort';
import selectionSort from '../../algorithms/sort/selectionSort';
import Controls from '../Controls';

const AlgorithmVisualizer = () => {
    const [array, setArray] = useState([]);
    const svgRef = useRef(null);
    const [animationSpeed] = useState(500);
    const [isSorting, setIsSorting] = useState(false);
    const [paused, setPaused] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');

    const sortingRef = useRef({
        isPaused: false,
        shouldStop: false,
    });

    const generateRandomArray = useCallback((size) => {
        return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    }, []);

    const initializeArray = useCallback(() => {
        const newArray = generateRandomArray(20);
        setArray(newArray);
        drawVisualizer(newArray);
    }, [generateRandomArray]);

    const drawVisualizer = (arr) => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // clear it

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

    const runAlgorithm = async (algorithmName) => {
        const arrayCopy = [...array]; // copy array but dont change state

        try {
            let success = false;
            switch (algorithmName) {
                case 'bubbleSort':
                    success = await bubbleSort(arrayCopy, drawVisualizer, animationSpeed, sortingRef);
                    break;
                case 'quickSort':
                    success = await quickSort(arrayCopy, drawVisualizer, animationSpeed, sortingRef);
                    break;
                case 'mergeSort':
                    success = await mergeSort(arrayCopy, drawVisualizer, animationSpeed, sortingRef);
                    break;
                case 'insertionSort':
                    success = await insertionSort(arrayCopy, drawVisualizer, animationSpeed, sortingRef);
                    break;
                case 'selectionSort':
                    success = await selectionSort(arrayCopy, drawVisualizer, animationSpeed, sortingRef);
                    break;
                default:
                    console.error("Invalid algorithm selected.");
            }

            if (!success && sortingRef.current && sortingRef.current.shouldStop) {
                console.log("Sorting stopped by user");
            }
        } catch (error) {
            console.error("Error during sorting:", error);
        } finally {
            setIsSorting(false);
        }
    };

    const startSortOrSearch = async () => {
        if (isSorting) return; // prevents double-click for start

        setIsSorting(true);
        setPaused(false);
        sortingRef.current = {
            isPaused: false,
            shouldStop: false,
        };

        await runAlgorithm(selectedAlgorithm);
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
        setIsSorting(false);
        setPaused(false);

        setTimeout(() => {
            initializeArray();
            sortingRef.current.shouldStop = false;
        }, 100); // small delay
    };

    useEffect(() => {
        initializeArray();
    }, [initializeArray]);

    return (
        <div className="visualization-container">
            <h1>Algorithm Visualizer</h1>
            <div className="visualization">
                <svg ref={svgRef} width="600" height="400" />
                <Controls
                    selectedAlgorithm={selectedAlgorithm}
                    setSelectedAlgorithm={setSelectedAlgorithm}
                    isSorting={isSorting}
                    paused={paused}
                    startSortOrSearch={startSortOrSearch}
                    handlePause={handlePause}
                    handleResume={handleResume}
                    handleReset={handleReset}
                />
            </div>
        </div>
    )
};

export default AlgorithmVisualizer;