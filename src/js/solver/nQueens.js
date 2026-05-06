import { isValid, formatSolution } from '../utils/helpers.js';

/**
 * Solves N-Queens and returns all solutions with stats
 * @param {number} n 
 * @returns {{ solutions: Array<Array<string>>, count: number, time: number }}
 */
export function solveNQueens(n) {
    const results = [];
    const queens = new Array(n).fill(-1);

    const startTime = performance.now();

    function backtrack(row) {
        if (row === n) {
            results.push(formatSolution([...queens], n));
            return;
        }

        for (let col = 0; col < n; col++) {
            if (isValid(queens, row, col)) {
                queens[row] = col;

                backtrack(row + 1);

                // 🔄 backtrack
                queens[row] = -1;
            }
        }
    }

    backtrack(0);

    const endTime = performance.now();

    return {
        solutions: results,
        count: results.length,
        time: (endTime - startTime).toFixed(2) // ms
    };
}