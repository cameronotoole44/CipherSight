import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { generateRandomArray } from '../../utils/generateArray';
import bubbleSort from '../../algorithms/bubbleSort';
import quickSort from '../../algorithms/quickSort';
import mergeSort from '../../algorithms/mergeSort';
import Controls from '../Controls';

const AlgorithmVisualizer = () => {
    const [array, setArray] = useState([]); // the array for sorting
    const svgRef = useRef(null);
    const [animationSpeed] = useState(500); // animation speed * coming back to this
    const [setIsSorting] = useState(false); // is it running?
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort'); // default

    // new array
    const initializeArray = useCallback(() => {
        const newArray = generateRandomArray(20);
        if (Array.isArray(newArray) && newArray.length > 0) {
            setArray(newArray);
            drawVisualizer(newArray);
        } else {
            console.error("Error: generated array is not valid");
        }
    }, []);

    const drawVisualizer = (arr) => {
        if (!svgRef.current) return;
        const svg = svgRef.current;
        svg.innerHTML = ''; // clear before drawing

        const width = 600;
        const barWidth = width / arr.length;
        const height = 400;

        arr.forEach((value, index) => {
            const barHeight = (value / 100) * height; // height based on the value
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', index * barWidth);
            rect.setAttribute('y', height - barHeight);
            rect.setAttribute('width', barWidth - 2);
            rect.setAttribute('height', barHeight);
            rect.setAttribute('fill', 'teal');
            svg.appendChild(rect);
        });
    };

    const startSort = (sortAlgorithm) => {
        if (!Array.isArray(array) || array.length === 0) {
            console.error("Array is invalid or empty.");
            return;
        }

        setIsSorting(true);

        switch (sortAlgorithm) {
            case 'bubbleSort':
                bubbleSort(array, drawVisualizer, animationSpeed).then(() => setIsSorting(false));
                break;
            case 'quickSort':
                quickSort(array, drawVisualizer, animationSpeed).then(() => setIsSorting(false));
                break;
            case 'mergeSort':
                mergeSort(array, drawVisualizer, animationSpeed).then(() => setIsSorting(false));
                break;
            default:
                console.error("Invalid algorithm selected.");
                setIsSorting(false);
        }
    };

    useEffect(() => {
        initializeArray(); // random array on initial load
    }, [initializeArray]);

    return (
        <div className="visualizer-container">
            <h1>Algorithm Visualizer</h1>
            <svg ref={svgRef} width="600" height="400"></svg>
            <Controls
                onStart={() => startSort(selectedAlgorithm)}
                onReset={initializeArray}
                onAlgorithmChange={setSelectedAlgorithm}
            />
        </div>
    );
};

export default AlgorithmVisualizer;