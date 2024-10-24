const selectionSort = async (arr, drawVisualizer, animationSpeed, sortingRef) => {
    const array = [...arr];
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            while (sortingRef.current.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (sortingRef.current.shouldStop) return false;
            }
            if (sortingRef.current.shouldStop) return false;

            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            drawVisualizer(array);
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            drawVisualizer(array);
        }
    }
    return true;
};

export default selectionSort;