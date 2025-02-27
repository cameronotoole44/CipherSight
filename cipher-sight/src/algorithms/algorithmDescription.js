import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AlgorithmDescription = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    let algorithmName = searchParams.get('algorithmName') || 'defaultAlgorithm';

    const algorithmMap = {
        'bfs': 'breadthFirstSearch',
        'dfs': 'depthFirstSearch',
    };

    if (algorithmMap[algorithmName]) {
        algorithmName = algorithmMap[algorithmName];
    }

    const descriptions = {
        bubbleSort: "Bubble Sort works by repeatedly stepping through a list, comparing each pair of adjacent items and swapping them if they're in the wrong order. Picture hobbits at the Green Dragon, rearranging their drinks from smallest to largest. Simple but not very efficient for large gatherings.",
        quickSort: "Quick Sort uses a divide-and-conquer strategy with a pivot element. It's like how Gandalf split the Fellowship when things got tough - choose a leader (pivot), organize everyone relative to that leader, then recursively sort the smaller groups until the whole company is in order.",
        mergeSort: "Merge Sort divides the list in half, sorts each half, then merges them back together. Think of the armies at Pelennor Fields - smaller organized units joining forces to create one massive, orderly battle formation. Efficient but requires extra space.",
        insertionSort: "Insertion Sort builds the final sorted array one item at a time. It's like Bilbo at Bag End, carefully placing each treasure he acquired in exactly the right spot among his already organized possessions. Works great for small collections or nearly-sorted items.",
        selectionSort: "Selection Sort repeatedly finds the minimum element from the unsorted part of the list. Just like Aragorn tracking through the wilderness - always identifying the smallest trace and moving it to where it belongs. Simple to understand but not the fastest option.",
        linearSearch: "Linear Search checks each element in sequence until finding what you need. Like the Fellowship wandering through the dark halls of Moria - checking each passage one by one, hoping to find the right path. Not fancy, but it always gets the job done eventually.",
        binarySearch: "Binary Search efficiently finds items in a sorted list by repeatedly dividing the search space in half. It's like searching for ancient lore in the libraries of Minas Tirith - start in the middle, decide if you need older or newer texts, and keep narrowing it down. Super fast, but only works if everything's already organized.",
        depthFirstSearch: "Depth-First Search explores as far down one path as possible before backtracking. Like Aragorn, Legolas, and Gimli pursuing the Uruk-hai - following one trail completely before trying other paths. Great for finding all possible solutions or exploring mazes.",
        breadthFirstSearch: "Breadth-First Search explores all neighbor nodes before moving to the next level. It spreads like the lighting of the beacons of Gondor - the signal reaches all nearby locations first before spreading to more distant ones. Perfect for finding the shortest path.",
        defaultAlgorithm: "No algorithm selected yet. Choose one to learn more about its inner workings and Middle-earth connections."
    };

    const timeComplexities = {
        bubbleSort: "Time Complexity: O(n²)",
        quickSort: "Time Complexity: O(n log n) on average, O(n²) in the worst case",
        mergeSort: "Time Complexity: O(n log n)",
        insertionSort: "Time Complexity: O(n²)",
        selectionSort: "Time Complexity: O(n²)",
        linearSearch: "Time Complexity: O(n)",
        binarySearch: "Time Complexity: O(log n)",
        depthFirstSearch: "Time Complexity: O(V + E) where V is vertices and E is edges",
        breadthFirstSearch: "Time Complexity: O(V + E) where V is vertices and E is edges",
        defaultAlgorithm: ""
    };

    const formatAlgorithmName = (name) => {
        if (name === 'defaultAlgorithm') return 'Algorithm Description';

        if (name === 'breadthFirstSearch') return 'Breadth-First Search (BFS)';
        if (name === 'depthFirstSearch') return 'Depth-First Search (DFS)';

        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
    };

    const description = descriptions[algorithmName] ||
        `Description for ${formatAlgorithmName(algorithmName)} is not available yet.`;

    const timeComplexity = timeComplexities[algorithmName] || '';

    return (
        <div className="algorithm-description">
            <button onClick={() => navigate(-1)} className="button back-button">
                Back
            </button>
            <h2>{formatAlgorithmName(algorithmName)}</h2>
            <p>{description}</p>
            {timeComplexity && <p>{timeComplexity}</p>}
        </div>
    );
};

export default AlgorithmDescription;