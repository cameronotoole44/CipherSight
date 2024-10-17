const bubbleSort = async (arr, updateVisualizer, animationSpeed) => {
    let arrayCopy = [...arr]; // creates a copy of array to sort
    let n = arrayCopy.length;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arrayCopy[j] > arrayCopy[j + 1]) {
                [arrayCopy[j], arrayCopy[j + 1]] = [arrayCopy[j + 1], arrayCopy[j]];
                updateVisualizer(arrayCopy);
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
            }
        }
    }
};

export default bubbleSort;