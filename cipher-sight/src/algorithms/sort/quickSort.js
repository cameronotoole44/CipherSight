const quickSort = async (arr, drawVisualizer, animationSpeed, sortingRef) => {
    const partition = async (array, low, high) => {
        const pivot = array[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            while (sortingRef.current.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (sortingRef.current.shouldStop) return -1;
            }
            if (sortingRef.current.shouldStop) return -1;

            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                drawVisualizer(array);
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
            }
        }
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        return i + 1;
    };

    const sort = async (array, low, high) => {
        if (low < high) {
            const pivotIndex = await partition(array, low, high);
            if (pivotIndex === -1) return false;

            const leftResult = await sort(array, low, pivotIndex - 1);
            if (!leftResult) return false;

            const rightResult = await sort(array, pivotIndex + 1, high);
            if (!rightResult) return false;
        }
        return true;
    };

    const arrayCopy = [...arr];
    return await sort(arrayCopy, 0, arrayCopy.length - 1);
};

export default quickSort;