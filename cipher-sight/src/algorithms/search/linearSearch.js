const linearSearch = async (arr, target, updateVisualizer, delay = 1000) => {
    for (let i = 0; i < arr.length; i++) {
        updateVisualizer(
            arr,
            i,
            arr.slice(0, i).map((_, idx) => idx),
            arr[i] === target
        );

        await new Promise(resolve => setTimeout(resolve, delay));

        if (arr[i] === target) {
            updateVisualizer(
                arr,
                i,
                arr.slice(0, i + 1).map((_, idx) => idx),
                true
            );
            return i;
        }
    }

    updateVisualizer(
        arr,
        -1,
        arr.map((_, idx) => idx),
        false
    );
    return -1;
};

export default linearSearch;