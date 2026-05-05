import { isValid, formatSolution } from '../utils/helpers.js';

/**
 * Solves N-Queens and returns all solutions in the required format
 * @param {number} n 
 * @returns {{ solutions: Array<Array<string>>, count: number }}
 */
export function solveNQueens(n) {
    const results = [];
    const queens = new Array(n).fill(-1);

    function backtrack(row) {
        if (row === n) {
            results.push(formatSolution([...queens], n));
            return;
        }

        for (let col = 0; col < n; col++) {
            if (isValid(queens, row, col)) {
                queens[row] = col;
                backtrack(row + 1);
                queens[row] = -1; // reset/backtrack
            }
        }
    }

    backtrack(0);
    return {
        solutions: results,
        count: results.length
    };
}
