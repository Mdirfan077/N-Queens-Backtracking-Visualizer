import { isValid } from '../utils/helpers.js';

/**
 * Generator function that yields the current state of the board at each step
 * @param {number} n 
 */
export function* stepSolveNQueens(n) {
    const queens = new Array(n).fill(-1);
    let backtracks = 0;

    function* backtrack(row) {
        if (row === n) {
            yield { type: 'FOUND_SOLUTION', queens: [...queens] };
            return;
        }

        for (let col = 0; col < n; col++) {
            // Yield checking status
            yield { type: 'CHECKING', row, col, queens: [...queens] };

            if (isValid(queens, row, col)) {
                queens[row] = col;
                yield { type: 'PLACED', row, col, queens: [...queens] };
                
                yield* backtrack(row + 1);
                
                // Backtrack
                queens[row] = -1;
                backtracks++;
                yield { type: 'BACKTRACKING', row, col, queens: [...queens], backtrackCount: backtracks };
            } else {
                yield { type: 'CONFLICT', row, col, queens: [...queens] };
            }
        }
    }

    yield* backtrack(0);
}
