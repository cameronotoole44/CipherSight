async function binarySearch(arr, target, drawArray, controlRef, animationSpeed = 800) {
    let low = 0;
    let high = arr.length - 1;
    const visitedIndices = [];

    const delay = async (ms) => {
        await new Promise(resolve => setTimeout(resolve, ms));

        while (controlRef.current.isPaused) {
            if (controlRef.current.shouldStop) return true;
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return controlRef.current.shouldStop;
    };

    drawArray(arr, -1, visitedIndices, false, low, high);
    if (await delay(animationSpeed)) return -1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        visitedIndices.push(mid);
        // current element being checked gets highlighted
        drawArray(arr, mid, visitedIndices, false, low, high);
        if (await delay(animationSpeed)) return -1;
        if (arr[mid] === target) {
            // target found highlight it
            drawArray(arr, mid, visitedIndices, true, low, high);
            return mid;
        }

        if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
        drawArray(arr, -1, visitedIndices, false, low, high);
        if (await delay(animationSpeed)) return -1;
    }

    // not found show the final state
    drawArray(arr, -1, visitedIndices, false, low, high);
    return -1;
}

export default binarySearch;