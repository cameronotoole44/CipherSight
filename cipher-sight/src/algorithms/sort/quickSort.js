const quickSort = async (arr, updateVisualizer, animationSpeed) => {
    const sort = async (array, low, high) => {
        if (low < high) {
            const pivotIndex = await partition(array, low, high);
            await sort(array, low, pivotIndex - 1);
            await sort(array, pivotIndex + 1, high);
        }
    };

    const partition = async (array, low, high) => {
        const pivot = array[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                updateVisualizer(array);
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
            }
        }
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        return i + 1;
    };

    await sort(arr, 0, arr.length - 1);
};

export default quickSort;