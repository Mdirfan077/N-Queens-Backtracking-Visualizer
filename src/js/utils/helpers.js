export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Formats a board array into the required array of strings format
 * @param {Array<number>} queens - Array where index is row and value is column
 * @param {number} n - Board size
 * @returns {Array<string>}
 */
export const formatSolution = (queens, n) => {
    return queens.map(col => {
        let rowStr = '';
        for (let i = 0; i < n; i++) {
            rowStr += (i === col) ? 'Q' : '#';
        }
        return rowStr;
    });
};

/**
 * Creates a clean n x n board representation
 */
export const createEmptyBoard = (n) => {
    return Array.from({ length: n }, () => Array(n).fill('#'));
};

/**
 * Checks if a queen can be placed at board[row][col]
 */
export const isValid = (queens, row, col) => {
    for (let r = 0; r < row; r++) {
        const c = queens[r];
        if (c === col || 
            Math.abs(c - col) === Math.abs(r - row)) {
            return false;
        }
    }
    return true;
};
