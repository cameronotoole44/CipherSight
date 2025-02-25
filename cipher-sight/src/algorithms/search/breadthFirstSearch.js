const breadthFirstSearch = async (graph, drawCallback, delay = 1000) => {
    const startNodeId = Object.keys(graph)[0];
    const visited = new Set();
    const queue = [startNodeId];
    const steps = [];
    const edgesVisited = new Set();

    const recordStep = (node, desc) => {
        const step = {
            currentNode: node,
            visited: [...visited],
            frontier: [...queue],
            edgesVisited: new Set([...edgesVisited]),
            description: desc
        };
        steps.push(step);

        if (drawCallback) {
            drawCallback(step);
            return new Promise(resolve => setTimeout(resolve, delay));
        }
        return Promise.resolve();
    };

    await recordStep(null, `Starting BFS from node ${startNodeId}`);

    while (queue.length > 0) {
        const currentNode = queue.shift();

        if (!visited.has(currentNode)) {
            visited.add(currentNode);
            await recordStep(currentNode, `Visit node ${currentNode}`);

            const neighbors = graph[currentNode] || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor) && !queue.includes(neighbor)) {
                    queue.push(neighbor);
                    edgesVisited.add(`${currentNode}-${neighbor}`);

                    await recordStep(currentNode, `Add ${neighbor} to queue`);
                }
            }
        }
    }

    await recordStep(null, 'BFS traversal complete');
    return {
        steps,
        visitedNodes: [...visited],
        edgesVisited: [...edgesVisited]
    };
};

export default breadthFirstSearch;