const bubbleSort = async (array, updateVisualizer, speed, sortingRef) => {
    const n = array.length;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {

            // check if paused
            while (sortingRef.current.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (sortingRef.current.shouldStop) return false;
            }

            // stop condition
            if (sortingRef.current.shouldStop) return false;

            // sorting step
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                updateVisualizer([...array]);
                await new Promise(resolve => setTimeout(resolve, speed));
            }
        }
    }
    return true;
};

export default bubbleSort;