const insertionSort = async (arr, drawVisualizer, animationSpeed, sortingRef) => {
    const array = [...arr];

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        while (j >= 0 && array[j] > key) {
            while (sortingRef.current.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (sortingRef.current.shouldStop) return false;
            }
            if (sortingRef.current.shouldStop) return false;

            array[j + 1] = array[j];
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            drawVisualizer(array);
            j = j - 1;
        }
        array[j + 1] = key;
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        drawVisualizer(array);
    }
    return true;
};

export default insertionSort;