import { SOLUTION_COUNTS } from '../utils/constants.js';

/**
 * Initialize stats table
 */
export function initStats() {
    const statsBody = document.getElementById('stats-body');
    if (!statsBody) return;

    statsBody.innerHTML = '';

    for (let n = 1; n <= 9; n++) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>N = ${n}</td>
            <td><strong>${SOLUTION_COUNTS[n]}</strong></td>
            <td>${getUniqueSolutions(n)}</td>
        `;

        // 🔥 Hover effect class (for UI polish)
        row.classList.add('stats-row');

        statsBody.appendChild(row);
    }
}

/**
 * Update live solver stats
 */
export function updateSolverStats(count, backtracks) {
    const statsPanel = document.getElementById('solver-stats');
    const solutionCount = document.getElementById('solution-count');
    const backtrackCount = document.getElementById('backtrack-count');

    if (!statsPanel || !solutionCount || !backtrackCount) return;

    statsPanel.classList.remove('hidden');

    solutionCount.textContent = count;
    backtrackCount.textContent = backtracks;

    // 🔥 Highlight animation
    solutionCount.classList.add('pulse');
    setTimeout(() => solutionCount.classList.remove('pulse'), 300);
}

/**
 * Unique solutions lookup
 */
function getUniqueSolutions(n) {
    const unique = {
        1: 1, 2: 0, 3: 0, 4: 1, 5: 2, 6: 1, 7: 6, 8: 12, 9: 46
    };
    return unique[n] || 0;
}