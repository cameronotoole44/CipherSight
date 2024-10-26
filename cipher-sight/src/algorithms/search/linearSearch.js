const linearSearch = async (array, updateVisualizer, animationSpeed, target) => {
    for (let i = 0; i < array.length; i++) {
        updateVisualizer({
            currentIndex: i,
            found: array[i] === target,
            visitedIndices: Array.from({ length: i + 1 }, (_, idx) => idx)
        });

        await new Promise(resolve => setTimeout(resolve, animationSpeed));

        if (array[i] === target) {
            return i;
        }
    }
    return -1;
};

export default linearSearch;