import React from 'react';

const Controls = ({ onStart, onPause, onResume, onReset, onAlgorithmChange, selectedAlgorithm }) => {
    const handleAlgorithmChange = (e) => {
        onAlgorithmChange(e.target.value);
    };

    return (
        <div className="window-content">
            <div className="toolbar" style={{ marginBottom: '8px' }}>
                <select
                    onChange={handleAlgorithmChange}
                    value={selectedAlgorithm}
                    className="select"
                >
                    <option value="bubbleSort">Bubble Sort</option>
                    <option value="quickSort">Quick Sort</option>
                    <option value="mergeSort">Merge Sort</option>
                    <option value="selectionSort">Selection Sort</option>
                    <option value="insertionSort">Insertion Sort</option>
                    <option value="binarySearch">Binary Search</option>
                    <option value="linearSearch">Linear Search</option>
                    <option value="bfs">Breadth First Search</option>
                    <option value="dfs">Depth First Search</option>
                </select>
            </div>
            <div className="button-group">
                <button onClick={onStart} className="button">
                    ▶ Start
                </button>
                <button onClick={onPause} className="button">
                    ⏸ Pause
                </button>
                <button onClick={onResume} className="button">
                    ⏵ Resume
                </button>
                <button onClick={onReset} className="button">
                    ↺ Reset
                </button>
            </div>
        </div>
    )
};

export default Controls;