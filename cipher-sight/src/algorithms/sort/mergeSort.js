const mergeSort = async (arr, drawVisualizer, animationSpeed, sortingRef) => {

    const updateArray = (arr, startIdx, values) => {
        const newArr = [...arr];
        values.forEach((val, i) => {
            newArr[startIdx + i] = val;
        });
        return newArr;
    };

    const merge = async (array, startIdx, midIdx, endIdx) => {
        const leftSize = midIdx - startIdx;
        const rightSize = endIdx - midIdx;
        const left = array.slice(startIdx, midIdx);
        const right = array.slice(midIdx, endIdx);

        let leftPos = 0;
        let rightPos = 0;
        let arrayPos = startIdx;

        // merge two arrays
        while (leftPos < leftSize && rightPos < rightSize) {
            // pause
            if (sortingRef.current.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (sortingRef.current.shouldStop) return false;
                continue;
            }
            if (sortingRef.current.shouldStop) return false;

            if (left[leftPos] <= right[rightPos]) {
                arr[arrayPos] = left[leftPos];
                leftPos++;
            } else {
                arr[arrayPos] = right[rightPos];
                rightPos++;
            }

            arrayPos++;
            drawVisualizer([...arr]);
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }

        // remaining elements
        while (leftPos < leftSize) {
            if (sortingRef.current.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (sortingRef.current.shouldStop) return false;
                continue;
            }
            if (sortingRef.current.shouldStop) return false;

            arr[arrayPos] = left[leftPos];
            leftPos++;
            arrayPos++;
            drawVisualizer([...arr]);
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }

        while (rightPos < rightSize) {
            if (sortingRef.current.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (sortingRef.current.shouldStop) return false;
                continue;
            }
            if (sortingRef.current.shouldStop) return false;

            arr[arrayPos] = right[rightPos];
            rightPos++;
            arrayPos++;
            drawVisualizer([...arr]);
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }

        return true;
    };

    const mergeSortHelper = async (array, start, end) => {
        if (end - start <= 1) return true;

        const mid = Math.floor((start + end) / 2);

        // left half
        const leftSuccess = await mergeSortHelper(array, start, mid);
        if (!leftSuccess) return false;

        // right half
        const rightSuccess = await mergeSortHelper(array, mid, end);
        if (!rightSuccess) return false;

        // merge sorted halves
        return await merge(array, start, mid, end);
    };

    // start sorting
    const success = await mergeSortHelper(arr, 0, arr.length);
    return success ? arr : false;
};

export default mergeSort;