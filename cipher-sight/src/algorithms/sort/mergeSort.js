const mergeSort = async (arr, drawVisualizer, animationSpeed, sortingRef) => {
    const merge = async (left, right, startIdx) => {
        const sorted = [];
        let leftIndex = 0;
        let rightIndex = 0;
        const merged = [...arr];

        // merge two arrays
        while (leftIndex < left.length && rightIndex < right.length) {
            while (sortingRef.current.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (sortingRef.current.shouldStop) return false;
            }
            if (sortingRef.current.shouldStop) return false;

            if (left[leftIndex] < right[rightIndex]) {
                merged[startIdx + leftIndex + rightIndex] = left[leftIndex];
                leftIndex++;
            } else {
                merged[startIdx + leftIndex + rightIndex] = right[rightIndex];
                rightIndex++;
            }

            drawVisualizer(merged);
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }

        // left array
        while (leftIndex < left.length) {

            while (sortingRef.current.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (sortingRef.current.shouldStop) return false;
            }
            if (sortingRef.current.shouldStop) return false;

            merged[startIdx + leftIndex + rightIndex] = left[leftIndex];
            leftIndex++;
            drawVisualizer(merged);
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }

        // right array
        while (rightIndex < right.length) {
            while (sortingRef.current.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (sortingRef.current.shouldStop) return false;
            }
            if (sortingRef.current.shouldStop) return false;

            merged[startIdx + leftIndex + rightIndex] = right[rightIndex];
            rightIndex++;
            drawVisualizer(merged);
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }

        return merged;
    };

    const sort = async (array, startIdx = 0) => {
        if (array.length <= 1) return array;

        // check for pause / stop
        while (sortingRef.current.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait while paused
            if (sortingRef.current.shouldStop) return false;
        }
        if (sortingRef.current.shouldStop) return false;

        const mid = Math.floor(array.length / 2);
        const left = await sort(array.slice(0, mid), startIdx); // Recursively sort left
        if (!left) return false;

        const right = await sort(array.slice(mid), startIdx + mid); // Recursively sort right
        if (!right) return false;

        return await merge(left, right, startIdx); // merge the sorted halves
    };

    return await sort(arr); // start sorting
};

export default mergeSort;