/**
 * given a value, it produces a function that will take an array to add the value to
 * if an only if the value is not already in the array
 * @param a item to add
 */
export function addOnce<A>(a: A): (arr: A[]) => A[] {
    return function (arr) {
        if (arr.includes(a)) {
            return arr;
        }
        return [a, ...arr];
    };
}

/**
 * returns a human-readable string of date
 * e.g., 01 Feb 2018
 *
 * @param {Date} date
 */
export const toDateString = (date: Date): string => {
    return date.toUTCString().slice(5, 17);
};

export function throttle(callback: (...args) => void, limit: number): (...args) => void {
    let wait = false;
    return function (...args) {
        if (!wait) {
            callback(...args);
            wait = true;
            setTimeout(function () {
                wait = false;
            }, limit);
        }
    };
}

/**
 * Immutably remove item from array
 *
 * @param array array to remove item from
 * @param index index of item to be removed
 */
export function removeFrom<A>(array: A[], index: number): A[] {
    if (index < 0) {
        throw new Error('Tried to remove an item from an array at a negative index');
    }
    return [...array.slice(0, index), ...array.slice(index + 1)];
}

/**
 *
 * @param  {...any} args msgs to be logged
 * @returns the first argument passed
 */
export const log = (...args: unknown[]): unknown => {
    console.log(...args);
    return args[0];
};
