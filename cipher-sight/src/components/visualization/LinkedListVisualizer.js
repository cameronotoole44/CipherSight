import React, { useState, useEffect, useRef } from 'react';
import { generateSampleLinkedList } from '../../utils/generateLinkedList';

const LinkedListVisualizer = () => {
    const [linkedList, setLinkedList] = useState(null);
    const [visualElements, setVisualElements] = useState([]);
    const [newValue, setNewValue] = useState('');
    const [position, setPosition] = useState(0);
    const [operationLog, setOperationLog] = useState([]);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [animationInProgress, setAnimationInProgress] = useState(false);

    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const sampleList = generateSampleLinkedList(5);
        setLinkedList(sampleList);
        updateVisualization(sampleList);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging && containerRef.current) {
                const left = e.clientX - dragOffset.x;
                const top = e.clientY - dragOffset.y;
                containerRef.current.style.left = `${left}px`;
                containerRef.current.style.top = `${top}px`;
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    const handleMouseDown = (e) => {
        if (e.target.classList.contains('linked-list-titlebar')) {
            setIsDragging(true);
            const rect = containerRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    const updateVisualization = (list) => {
        if (!list) return;
        const elements = list.toArray();
        setVisualElements(elements);
    };

    const addLogEntry = (message) => {
        setOperationLog(prev => [...prev, message]);
    };

    const startAnimation = () => setAnimationInProgress(true);
    const endAnimation = () => setAnimationInProgress(false);
    const handleAppend = async () => {
        if (!newValue.trim() || animationInProgress || !linkedList) return;

        startAnimation();

        setHighlightIndex(linkedList.size);

        await new Promise(resolve => setTimeout(resolve, 500));

        linkedList.append(newValue);
        updateVisualization(linkedList);
        addLogEntry(`Appended value "${newValue}" to the end of the list`);

        setNewValue('');
        await new Promise(resolve => setTimeout(resolve, 500));
        setHighlightIndex(-1);

        endAnimation();
    };

    const handlePrepend = async () => {
        if (!newValue.trim() || animationInProgress || !linkedList) return;

        startAnimation();

        setHighlightIndex(0);

        await new Promise(resolve => setTimeout(resolve, 500));

        linkedList.prepend(newValue);
        updateVisualization(linkedList);
        addLogEntry(`Prepended value "${newValue}" to the beginning of the list`);

        setNewValue('');
        await new Promise(resolve => setTimeout(resolve, 500));
        setHighlightIndex(-1);

        endAnimation();
    };

    const handleInsertAt = async () => {
        if (!newValue.trim() || animationInProgress || !linkedList) return;

        const pos = parseInt(position);
        if (isNaN(pos) || pos < 0 || pos > linkedList.size) {
            addLogEntry(`Invalid position: ${position}`);
            return;
        }

        startAnimation();

        setHighlightIndex(pos);

        await new Promise(resolve => setTimeout(resolve, 500));

        linkedList.insertAt(newValue, pos);
        updateVisualization(linkedList);
        addLogEntry(`Inserted value "${newValue}" at position ${pos}`);

        setNewValue('');
        await new Promise(resolve => setTimeout(resolve, 500));
        setHighlightIndex(-1);

        endAnimation();
    };

    const handleRemove = async () => {
        if (!newValue.trim() || animationInProgress || !linkedList) return;

        startAnimation();

        let index = visualElements.findIndex(v => v === newValue);

        if (index === -1) {
            addLogEntry(`Value "${newValue}" not found in the list`);
            setNewValue('');
            endAnimation();
            return;
        }

        setHighlightIndex(index);

        await new Promise(resolve => setTimeout(resolve, 500));

        linkedList.remove(newValue);
        updateVisualization(linkedList);
        addLogEntry(`Removed value "${newValue}" from the list`);

        setNewValue('');
        setHighlightIndex(-1);

        endAnimation();
    };

    const handleRemoveAt = async () => {
        if (animationInProgress || !linkedList) return;

        const pos = parseInt(position);
        if (isNaN(pos) || pos < 0 || pos >= linkedList.size) {
            addLogEntry(`Invalid position: ${position}`);
            return;
        }

        startAnimation();

        setHighlightIndex(pos);

        await new Promise(resolve => setTimeout(resolve, 500));

        linkedList.removeAt(pos);
        updateVisualization(linkedList);
        addLogEntry(`Removed node at position ${pos}`);

        setHighlightIndex(-1);

        endAnimation();
    };

    return (
        <div
            className="linked-list-container"
            ref={containerRef}
            onMouseDown={handleMouseDown}
        >
            <div className="linked-list-titlebar">
                Linked List Visualization
            </div>

            <div className="linked-list-window-controls">
                <div className="linked-list-control-group">
                    <label>Value:</label>
                    <input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        disabled={animationInProgress}
                        className="linked-list-input"
                    />
                </div>

                <div className="linked-list-control-group">
                    <label>Position:</label>
                    <input
                        type="number"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        min="0"
                        max={linkedList ? linkedList.size : 0}
                        disabled={animationInProgress}
                        className="linked-list-input linked-list-input-small"
                    />
                </div>
            </div>

            <div className="linked-list-button-container">
                <button
                    onClick={handlePrepend}
                    disabled={!newValue.trim() || animationInProgress}
                    className="linked-list-button"
                >
                    Prepend
                </button>
                <button
                    onClick={handleAppend}
                    disabled={!newValue.trim() || animationInProgress}
                    className="linked-list-button"
                >
                    Append
                </button>
                <button
                    onClick={handleInsertAt}
                    disabled={!newValue.trim() || animationInProgress}
                    className="linked-list-button"
                >
                    Insert At
                </button>
                <button
                    onClick={handleRemove}
                    disabled={!newValue.trim() || animationInProgress || visualElements.length === 0}
                    className="linked-list-button"
                >
                    Remove Value
                </button>
                <button
                    onClick={handleRemoveAt}
                    disabled={animationInProgress || visualElements.length === 0}
                    className="linked-list-button"
                >
                    Remove At
                </button>
            </div>

            <div className="linked-list-visualization">
                {visualElements.length === 0 ? (
                    <div className="linked-list-empty-message">Empty linked list</div>
                ) : (
                    <div className="linked-list-nodes">
                        {visualElements.map((value, index) => (
                            <div key={index} className="linked-list-node-container">
                                <div className={`linked-list-node ${index === highlightIndex ? 'linked-list-node-highlighted' : ''}`}>
                                    <span className="linked-list-node-value">{value}</span>
                                    <span className="linked-list-node-index">index: {index}</span>
                                </div>

                                {index < visualElements.length - 1 && (
                                    <div className="linked-list-arrow">→</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="linked-list-log-container">
                <div className="linked-list-log-title">Operation Log:</div>
                {operationLog.length === 0 ? (
                    <div className="linked-list-empty-message">No operations performed yet</div>
                ) : (
                    <ul className="linked-list-log">
                        {operationLog.map((log, index) => (
                            <li key={index} className={`linked-list-log-item ${index === operationLog.length - 1 ? 'linked-list-log-item-last' : ''}`}>
                                {log}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LinkedListVisualizer;