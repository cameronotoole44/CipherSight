import React from "react";

const AlgorithmDescription = ({ algorithmName }) => {
    const descriptions = {
        bubbleSort: "Bubble Sort is a simple comparison-based algorithm where adjacent elements are compared and swapped if they are in the wrong order. Like hobbits arranging their feast tables - checking each pair of dishes and swapping them until everything's in order, from mushrooms to lembas bread.",
        quickSort: "Quick Sort is a divide-and-conquer algorithm that selects a pivot and partitions the array around the pivot, recursively sorting the subarrays. Think how Gandalf would divide the Fellowship - choose a leader (our pivot), gather those who follow, those who lead, then recursively organize each group until all are in formation.",
        mergeSort: "Merge Sort is a stable, comparison-based algorithm that divides the array into two halves, recursively sorts them, and then merges the sorted halves. Like how the armies at Pelennor Fields assembled - divide forces into smaller units, organize each unit, then merge them back together into one orderly army.",
        insertionSort: "Insertion Sort is a simple sorting algorithm that builds the sorted array one element at a time by repeatedly inserting elements into their correct position. Like Bilbo arranging his prized possessions at Bag End - taking each new item and finding its perfect spot among the already organized treasures.",
        selectionSort: "Selection Sort repeatedly selects the smallest element from the unsorted portion of the array and swaps it with the first unsorted element. Think of Aragorn tracking the smallest hobbit footprints - finding the smallest unsorted element and bringing it to the front, one at a time.",
        linearSearch: "Linear Search sequentially checks each element of a list until it finds the target value or reaches the end of the list. the Fellowship searching all of Moria for the right path - checking each door and passage one by one until finding the way.",
        binarySearch: "Binary Search is an efficient algorithm that repeatedly divides a sorted array in half to locate a target value. Like if you looked in the libraries of Minas Tirith - start at the middle scroll, check if your answer lies in the earlier or later texts, then repeat. Only works if the scrolls are properly archived though!",
        dfs: "Depth-First Search (DFS) is an algorithm that explores a graph by traversing as deep as possible along each branch before backtracking. When Aragorn, Legolas, and Gimli were pursuing the Uruk-hai - following each trail to its end before backtracking to try another path.",
        bfs: "Breadth-First Search (BFS) is an algorithm that explores a graph level by level, starting from the root node and visiting all of its neighbors before moving on. Spreads like the lighting of the beacons of Gondor - the signal spreading to all nearby beacons first before reaching the more distant ones."
    };

    const timeComplexities = {
        bubbleSort: "Time Complexity: O(n^2)",
        quickSort: "Time Complexity: O(n log n) on average, O(n^2) in the worst case",
        mergeSort: "Time Complexity: O(n log n)",
        insertionSort: "Time Complexity: O(n^2)",
        selectionSort: "Time Complexity: O(n^2)",
        linearSearch: "Time Complexity: O(n)",
        binarySearch: "Time Complexity: O(log n)",
        dfs: "Time Complexity: O(V + E) where V is vertices and E is edges",
        bfs: "Time Complexity: O(V + E) where V is vertices and E is edges"
    };

    return (
        <div className="algorithm-description">
            <h2>{algorithmName.replace(/([A-Z])/g, ' $1')}</h2>
            <p>{descriptions[algorithmName]}</p>
            <p>{timeComplexities[algorithmName]}</p>
        </div>
    )
};

export default AlgorithmDescription;
