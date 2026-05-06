import { isValid } from '../utils/helpers.js';

/**
 * Generator function for step-by-step solving
 * @param {number} n 
 */
export function* stepSolveNQueens(n) {
    const queens = new Array(n).fill(-1);
    let backtracks = 0;
    let steps = 0;

    function* backtrack(row) {
        if (row === n) {
            steps++;
            yield {
                type: 'FOUND_SOLUTION',
                queens: [...queens],
                stepCount: steps,
                backtrackCount: backtracks
            };
            return;
        }

        for (let col = 0; col < n; col++) {
            steps++;

            // 🔍 Checking
            yield {
                type: 'CHECKING',
                row,
                col,
                queens: [...queens],
                stepCount: steps
            };

            if (isValid(queens, row, col)) {
                queens[row] = col;

                steps++;

                // ✅ Placed
                yield {
                    type: 'PLACED',
                    row,
                    col,
                    queens: [...queens],
                    stepCount: steps
                };

                yield* backtrack(row + 1);

                // 🔄 Backtrack
                queens[row] = -1;
                backtracks++;
                steps++;

                yield {
                    type: 'BACKTRACKING',
                    row,
                    col,
                    queens: [...queens],
                    backtrackCount: backtracks,
                    stepCount: steps
                };
            } else {
                steps++;

                // ❌ Conflict
                yield {
                    type: 'CONFLICT',
                    row,
                    col,
                    queens: [...queens],
                    stepCount: steps
                };
            }
        }
    }

    yield* backtrack(0);
}