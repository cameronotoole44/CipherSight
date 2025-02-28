const linearSearch = async (arr, target, drawArray, controlRef, animationSpeed = 800) => {
    const visitedIndices = [];

    const delay = async (ms) => {
        await new Promise(resolve => setTimeout(resolve, ms));

        while (controlRef.current.isPaused) {
            if (controlRef.current.shouldStop) return true;
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return controlRef.current.shouldStop;
    };

    drawArray(arr, -1, visitedIndices, false, 0, arr.length - 1);
    if (await delay(animationSpeed / 2)) return -1;

    for (let i = 0; i < arr.length; i++) {
        visitedIndices.push(i);

        drawArray(arr, i, visitedIndices, false, 0, arr.length - 1);
        if (await delay(animationSpeed)) return -1;
        if (arr[i] === target) {

            drawArray(arr, i, visitedIndices, true, 0, arr.length - 1);
            return i;
        }
    }

    drawArray(arr, -1, visitedIndices, false, 0, arr.length - 1);
    return -1;
};

export default linearSearch;