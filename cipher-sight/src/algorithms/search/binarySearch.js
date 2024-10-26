const binarySearch = async (array, updateVisualizer, animationSpeed, target) => {
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        updateVisualizer({
            currentIndex: mid,
            found: array[mid] === target,
            visitedIndices: [mid],
            leftBound: left,
            rightBound: right
        });

        await new Promise(resolve => setTimeout(resolve, animationSpeed));

        if (array[mid] === target) {
            return mid;
        }

        if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
};

export default binarySearch;