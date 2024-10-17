const insertionSort = async (array, updateVisualizer, speed) => {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        // moves elements of array[0..i-1] that are greater than key to one position ahead of their current position
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            await new Promise((resolve) => setTimeout(resolve, speed));
            updateVisualizer(array);
            j = j - 1;
        }
        array[j + 1] = key;
        await new Promise((resolve) => setTimeout(resolve, speed));
        updateVisualizer(array);
    }
};

export default insertionSort;