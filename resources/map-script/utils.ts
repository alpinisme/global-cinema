/**
 * escapes html special chars
 * @param {string} input string to be escaped
 */
export const escapeHtml = (input: string | null): string => {
    const text = input ?? '';

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 *
 * @param  {...any} args msgs to be logged
 * @returns the first argument passed
 */
export const log = (...args: unknown[]): unknown => {
    console.log(...args);
    return args[0];
};
