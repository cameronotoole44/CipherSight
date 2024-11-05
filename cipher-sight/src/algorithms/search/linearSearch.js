const linearSearch = async (arr, updateVisualizer, delay, target) => {
    for (let i = 0; i < arr.length; i++) {
        // highlight element thats being checked
        await updateVisualizer({
            type: 'search',
            currentIndex: i,
            visitedIndices: Array.from({ length: i }, (_, idx) => idx),
            found: arr[i] === target
        });

        await new Promise(resolve => setTimeout(resolve, delay));

        if (arr[i] === target) {
            // target found
            await updateVisualizer({
                type: 'search',
                currentIndex: i,
                visitedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
                found: true
            });
            return i;
        }
    }

    // target not found
    await updateVisualizer({
        type: 'search',
        currentIndex: -1,
        visitedIndices: Array.from({ length: arr.length }, (_, idx) => idx),
        found: false
    });
    return -1;
};

export default linearSearch;