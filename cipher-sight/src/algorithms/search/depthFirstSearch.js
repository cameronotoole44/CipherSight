const depthFirstSearch = async (graph, drawCallback, delay = 1000) => {
    const startNodeId = Object.keys(graph)[0];
    const visited = new Set();
    const stack = [startNodeId];
    const steps = [];
    const edgesVisited = new Set();

    const recordStep = (node, desc) => {
        const step = {
            currentNode: node,
            visited: [...visited],
            frontier: [...stack],
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

    await recordStep(null, `Starting DFS from node ${startNodeId}`);

    while (stack.length > 0) {
        const currentNode = stack.pop();

        if (!visited.has(currentNode)) {
            visited.add(currentNode);

            await recordStep(currentNode, `Visit node ${currentNode}`);

            const neighbors = [...(graph[currentNode] || [])].reverse();
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    stack.push(neighbor);
                    edgesVisited.add(`${currentNode}-${neighbor}`);

                    await recordStep(currentNode, `Add ${neighbor} to stack`);
                }
            }
        }
    }

    await recordStep(null, 'DFS traversal complete');
    return {
        steps,
        visitedNodes: [...visited],
        edgesVisited: [...edgesVisited]
    };
};

export default depthFirstSearch;