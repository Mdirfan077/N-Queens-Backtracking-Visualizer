import { QUEEN_UNICODE } from '../utils/constants.js';

const boardElement = document.getElementById('chessboard');

/**
 * Initializes and renders an empty board of size n
 * @param {number} n 
 */
export function initBoard(n) {
    boardElement.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    boardElement.innerHTML = '';
    
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            const cell = document.createElement('div');
            cell.className = `cell cell-reveal ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.id = `cell-${r}-${c}`;
            
            // Staggered delay
            cell.style.animationDelay = `${(r * n + c) * 20}ms`;
            
            boardElement.appendChild(cell);
        }
    }
}

/**
 * Updates the board based on a solver step
 * @param {Object} step 
 */
export function updateBoard(step) {
    const { type, row, col, queens } = step;
    
    // Clear temporary classes from all cells
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('active', 'conflict', 'valid');
        // Clear queen if it's not in the queens array for this row
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        if (queens[r] === -1 || queens[r] !== c) {
            cell.innerHTML = '';
        } else {
            cell.innerHTML = `<span class="queen queen-pop">${QUEEN_UNICODE}</span>`;
        }
    });

    if (type === 'CHECKING') {
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.classList.add('active');
        cell.innerHTML = `<span class="queen" style="opacity: 0.5">${QUEEN_UNICODE}</span>`;
    } else if (type === 'CONFLICT') {
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.classList.add('conflict');
        cell.innerHTML = `<span class="queen">${QUEEN_UNICODE}</span>`;
    } else if (type === 'PLACED') {
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.classList.add('valid');
        cell.innerHTML = `<span class="queen queen-pop">${QUEEN_UNICODE}</span>`;
    }
}

/**
 * Renders a small board configuration for the gallery
 */
export function renderMiniBoard(container, solution, n) {
    container.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    container.innerHTML = '';
    
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            const cell = document.createElement('div');
            const isDark = (r + c) % 2 !== 0;
            cell.className = `mini-cell ${isDark ? 'dark' : 'light'}`;
            cell.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'transparent';
            
            if (solution[r][c] === 'Q') {
                cell.innerHTML = `<span class="queen" style="font-size: 1.2rem">${QUEEN_UNICODE}</span>`;
            } else {
                cell.textContent = '#';
                cell.style.color = 'var(--text-muted)';
                cell.style.fontSize = '0.6rem';
            }
            container.appendChild(cell);
        }
    }
}
