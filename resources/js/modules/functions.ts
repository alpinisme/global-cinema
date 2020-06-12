export function addOnce<A>(a: A): (arr: A[]) => A[] {
    return function(arr) {
        if (arr.includes(a)) {
            return arr;
        }
        return [a, ...arr];
    };
}
