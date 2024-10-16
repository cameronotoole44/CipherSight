/**
 * @param {number} size - size of the array
 * @param {number} max - max value for the random integers
 * @returns {number[]} - array of random integers
 */
export const generateRandomArray = (size, max = 100) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1)
};