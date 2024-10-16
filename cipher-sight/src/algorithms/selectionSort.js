const selectionSort = async (array, updateVisualizer, speed) => {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            await new Promise((resolve) => setTimeout(resolve, speed));
            updateVisualizer(array);
        }
        // swap the found minimum element with the first element
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            await new Promise((resolve) => setTimeout(resolve, speed));
            updateVisualizer(array);
        }
    }
};

export default selectionSort;