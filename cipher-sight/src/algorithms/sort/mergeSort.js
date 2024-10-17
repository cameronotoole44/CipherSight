const mergeSort = async (arr, updateVisualizer, animationSpeed) => {
    const merge = async (left, right) => {
        const sorted = [];
        while (left.length && right.length) {
            if (left[0] < right[0]) {
                sorted.push(left.shift());
            } else {
                sorted.push(right.shift());
            }
            updateVisualizer([...sorted, ...left, ...right]);
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }
        return [...sorted, ...left, ...right];
    };

    const sort = async (array) => {
        if (array.length <= 1) return array;
        const mid = Math.floor(array.length / 2);
        const left = await sort(array.slice(0, mid));
        const right = await sort(array.slice(mid));
        return await merge(left, right);
    };

    await sort(arr);
};

export default mergeSort;