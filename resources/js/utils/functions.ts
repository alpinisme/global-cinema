export function addOnce<A>(a: A): (arr: A[]) => A[] {
    return function(arr) {
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
