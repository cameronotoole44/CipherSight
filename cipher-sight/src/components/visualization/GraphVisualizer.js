import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import bfs from '../../algorithms/search/breadthFirstSearch';
import dfs from '../../algorithms/search/depthFirstSearch';
import { generateSampleGraph } from '../../utils/generateGraph';

const GraphVisualizer = forwardRef(({ algorithm, animationSpeed = 1000 }, ref) => {
    const [graph, setGraph] = useState({});
    const [nodePositions, setNodePositions] = useState({});
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const controlRef = useRef({
        isPaused: false,
        shouldStop: false
    });

    useEffect(() => {
        const adjacencyList = generateSampleGraph();
        setGraph(adjacencyList);
        const nodes = Object.keys(adjacencyList);
        const radius = 150;
        const center = { x: 200, y: 200 };
        const positions = {};
        nodes.forEach((node, i) => {
            const angle = (i / nodes.length) * 2 * Math.PI;
            positions[node] = {
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle)
            };
        });

        setNodePositions(positions);
    }, []);

    useImperativeHandle(ref, () => ({
        startVisualization: () => {
            runAlgorithm();
        },
        pauseVisualization: () => {
            controlRef.current.isPaused = true;
            setIsPaused(true);
        },
        resumeVisualization: () => {
            controlRef.current.isPaused = false;
            setIsPaused(false);
        },
        resetVisualization: () => {
            controlRef.current.shouldStop = true;
            controlRef.current.isPaused = false;
            setIsRunning(false);
            setIsPaused(false);
            setCurrentStepIndex(0);
        }
    }));

    const processStep = async (step, index) => {
        if (controlRef.current.shouldStop) {
            setIsRunning(false);
            return;
        }

        while (controlRef.current.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (controlRef.current.shouldStop) {
                setIsRunning(false);
                return;
            }
        }

        setCurrentStepIndex(index);

        await new Promise(resolve => setTimeout(resolve, animationSpeed));
    };

    const runAlgorithm = async () => {
        if (isRunning) return;

        setIsRunning(true);
        controlRef.current.shouldStop = false;
        controlRef.current.isPaused = false;

        const stepCollector = [];
        const collectStep = (step) => {
            stepCollector.push({ ...step });
            return Promise.resolve();
        };

        const algoFunction = algorithm === 'bfs' ? bfs : dfs;
        await algoFunction(graph, collectStep, 0);

        setSteps(stepCollector);

        for (let i = 0; i < stepCollector.length; i++) {
            await processStep(stepCollector[i], i);
            if (controlRef.current.shouldStop) break;
        }

        setIsRunning(false);
    };

    const currentStep = steps[currentStepIndex] || {
        currentNode: null,
        visited: [],
        frontier: [],
        edgesVisited: new Set()
    };

    const renderEdges = () => {
        const edges = [];

        Object.entries(graph).forEach(([node, neighbors]) => {
            neighbors.forEach(neighbor => {
                if (node < neighbor || !graph[neighbor]?.includes(node)) {
                    const startPos = nodePositions[node] || { x: 0, y: 0 };
                    const endPos = nodePositions[neighbor] || { x: 0, y: 0 };
                    const isVisited =
                        currentStep.edgesVisited?.has(`${node}-${neighbor}`) ||
                        currentStep.edgesVisited?.has(`${neighbor}-${node}`);
                    edges.push(
                        <line
                            key={`${node}-${neighbor}`}
                            x1={startPos.x}
                            y1={startPos.y}
                            x2={endPos.x}
                            y2={endPos.y}
                            stroke={isVisited ? 'var(--win98-edge-visited)' : 'var(--win98-edge-default)'}
                            strokeWidth={isVisited ? 3 : 1.5}
                        />
                    );
                }
            });
        });
        return edges;
    };

    return (
        <div className={`graph-container ${isPaused ? 'graph-paused' : ''}`}>
            <div className="graph-info-panel">
                <h3 className="graph-title">
                    {algorithm === 'bfs' ? 'Breadth-First Search' : 'Depth-First Search'}
                </h3>
                <div className="graph-step-info">
                    <span className="graph-step-counter">Step {currentStepIndex + 1} of {steps.length || '?'}</span>
                    <p className="graph-description">
                        {currentStep.description || 'Click Start to begin visualization'}
                    </p>
                </div>
            </div>

            <div className="graph-visualization-area">
                <svg width="400" height="400" viewBox="0 0 400 400">
                    {renderEdges()}
                    {Object.entries(nodePositions).map(([node, pos]) => {
                        const isVisited = currentStep.visited?.includes(node);
                        const isFrontier = currentStep.frontier?.includes(node);
                        const isCurrent = currentStep.currentNode === node;
                        let fillColor = "#fff";
                        if (isCurrent) fillColor = "var(--win98-node-current)";
                        else if (isVisited) fillColor = "var(--win98-node-visited)";
                        else if (isFrontier) fillColor = "var(--win98-node-frontier)";
                        return (
                            <g key={node}>
                                <motion.circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={25}
                                    fill={fillColor}
                                    stroke="#000"
                                    strokeWidth={2}
                                    initial={{ scale: 0 }}
                                    animate={{
                                        scale: 1,
                                        fill: fillColor
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        fill: { duration: 0.2 }
                                    }}
                                />
                                <text
                                    x={pos.x}
                                    y={pos.y}
                                    textAnchor="middle"
                                    dy=".3em"
                                    fontSize="16"
                                    fontWeight="bold"
                                >
                                    {node}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="graph-data-container">
                <div className="graph-data-panel">
                    <h4 className="graph-data-title">{algorithm === 'bfs' ? 'Queue' : 'Stack'}</h4>
                    <div className="graph-data-items">
                        {currentStep.frontier?.map((node, index) => (
                            <div key={index} className="graph-node-item graph-frontier-item">
                                {node}
                            </div>
                        ))}
                        {(!currentStep.frontier || currentStep.frontier.length === 0) && (
                            <div className="graph-empty-message">Empty</div>
                        )}
                    </div>
                </div>

                <div className="graph-data-panel">
                    <h4 className="graph-data-title">Visited Nodes</h4>
                    <div className="graph-data-items">
                        {currentStep.visited?.map((node, index) => (
                            <div key={index} className="graph-node-item graph-visited-item">
                                {node}
                            </div>
                        ))}
                        {(!currentStep.visited || currentStep.visited.length === 0) && (
                            <div className="graph-empty-message">None</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default GraphVisualizer;