import { QUEEN_CHAR, EMPTY_CHAR } from './constants.js';

/**
 * Delay helper (async/await)
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Format solution into array of strings
 * Example: ["#Q##", "###Q", "Q###", "##Q#"]
 */
export const formatSolution = (queens, n) => {
    return queens.map(col => {
        let rowStr = '';
        for (let i = 0; i < n; i++) {
            rowStr += (i === col) ? QUEEN_CHAR : EMPTY_CHAR;
        }
        return rowStr;
    });
};

/**
 * Create empty board
 */
export const createEmptyBoard = (n) => {
    return Array.from({ length: n }, () =>
        Array(n).fill(EMPTY_CHAR)
    );
};

/**
 * Check if queen placement is valid
 */
export const isValid = (queens, row, col) => {
    for (let r = 0; r < row; r++) {
        const c = queens[r];

        // Same column OR diagonal conflict
        if (
            c === col ||
            Math.abs(c - col) === Math.abs(r - row)
        ) {
            return false;
        }
    }
    return true;
};