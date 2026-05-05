import { SOLUTION_COUNTS } from '../utils/constants.js';

export function initStats() {
    const statsBody = document.getElementById('stats-body');
    statsBody.innerHTML = '';

    for (let n = 1; n <= 9; n++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>N = ${n}</td>
            <td><strong>${SOLUTION_COUNTS[n]}</strong></td>
            <td>${getUniqueSolutions(n)}</td>
        `;
        statsBody.appendChild(row);
    }
}

export function updateSolverStats(count, backtracks) {
    const statsPanel = document.getElementById('solver-stats');
    const solutionCount = document.getElementById('solution-count');
    const backtrackCount = document.getElementById('backtrack-count');

    statsPanel.classList.remove('hidden');
    solutionCount.textContent = count;
    backtrackCount.textContent = backtracks;
}

function getUniqueSolutions(n) {
    const unique = {
        1: 1, 2: 0, 3: 0, 4: 1, 5: 2, 6: 1, 7: 6, 8: 12, 9: 46
    };
    return unique[n] || 0;
}
