export class Graph {
    constructor(isDirected = false, isWeighted = false) {
        this.vertices = new Map();
        this.isDirected = isDirected;
        this.isWeighted = isWeighted;
    }
    addVertex(vertex) {
        if (!this.vertices.has(vertex)) {
            this.vertices.set(vertex, []);
        }
        return this;
    }
    addEdge(source, destination, weight = 1) {
        if (!this.vertices.has(source)) this.addVertex(source);
        if (!this.vertices.has(destination)) this.addVertex(destination);

        const sourceEdges = this.vertices.get(source);
        const edge = this.isWeighted ? { vertex: destination, weight } : destination;
        sourceEdges.push(edge);
        if (!this.isDirected) {
            const destEdges = this.vertices.get(destination);
            const reverseEdge = this.isWeighted ? { vertex: source, weight } : source;
            destEdges.push(reverseEdge);
        }
        return this;
    }

    toAdjacencyList() {
        const adjacencyList = {};

        this.vertices.forEach((edges, vertex) => {
            adjacencyList[vertex] = edges.map(edge =>
                this.isWeighted ? edge.vertex : edge
            );
        });
        return adjacencyList;
    }
}

export const generateSampleGraph = () => {
    const graph = new Graph();

    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(vertex => {
        graph.addVertex(vertex);
    });

    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('B', 'E');
    graph.addEdge('C', 'F');
    graph.addEdge('E', 'F');

    return graph.toAdjacencyList();
};