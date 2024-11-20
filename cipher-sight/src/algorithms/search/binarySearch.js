export async function binarySearch(arr, target, drawArray) {
    let low = 0;
    let high = arr.length - 1;
    const visitedIndices = [];

    // console.log("Array to search:", arr);
    // console.log("Target to find:", target);

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        visitedIndices.push(mid);

        drawArray(arr, mid, visitedIndices, false, low, high);

        await delay(800);

        if (arr[mid] === target) {
            drawArray(arr, mid, visitedIndices, true, low, high);
            // console.log('Target found at index:', mid);
            return mid;
        }

        if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }

        await delay(800);
    }

    // console.log('Target not found');
    drawArray(arr, -1, visitedIndices, false, low, high);
    return -1;
}

export default binarySearch;