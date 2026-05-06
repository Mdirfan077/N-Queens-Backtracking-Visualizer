import { QUEEN_UNICODE } from '../utils/constants.js';
import { getState } from '../state.js';


// 🔊 Sound setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export function unlockAudio() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playBeep(freq = 500, duration = 120, type = 'sine') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

    osc.start();

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration / 1000
    );

    osc.stop(audioCtx.currentTime + duration / 1000);
}

// Better UX

const boardElement = document.getElementById('chessboard');


// let audioUnlocked = false;

// export function unlockAudio() {
//     if (audioUnlocked) return;

//     placeSound.play().catch(() => {});
//     errorSound.play().catch(() => {});

//     placeSound.pause();
//     errorSound.pause();

//     placeSound.currentTime = 0;
//     errorSound.currentTime = 0;

//     audioUnlocked = true;
// }


/**
 * Initialize board
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

            cell.style.animationDelay = `${(r * n + c) * 20}ms`;

            boardElement.appendChild(cell);
        }
    }
}

/**
 * Update board on each step
 */
export function updateBoard(step) {
    const { type, row, col, queens } = step;

    const cells = boardElement.querySelectorAll('.cell');

    // Clear previous states
    cells.forEach(cell => {
        cell.classList.remove(
            'active',
            'conflict',
            'valid',
            'highlight-row',
            'highlight-col'
        );

        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);

        if (queens[r] === -1 || queens[r] !== c) {
            cell.innerHTML = '';
        } else {
            cell.innerHTML = `<span class="queen queen-pop">${QUEEN_UNICODE}</span>`;
        }
    });

    // 🔍 CHECKING
    if (type === 'CHECKING') {
        const currentCell = document.getElementById(`cell-${row}-${col}`);
        currentCell.classList.add('active');

        // 🔥 Highlight row & column
        cells.forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);

            if (r === row) cell.classList.add('highlight-row');
            if (c === col) cell.classList.add('highlight-col');
        });

        currentCell.innerHTML = `<span class="queen" style="opacity: 0.5">${QUEEN_UNICODE}</span>`;
    }

    // ❌ CONFLICT
    else if (type === 'CONFLICT') {
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.classList.add('conflict');
        cell.innerHTML = `<span class="queen">${QUEEN_UNICODE}</span>`;

        if (getState().soundEnabled) {
            playBeep(200, 200, 'sawtooth'); // error sound
        }
    }

    // ✅ PLACED
    else if (type === 'PLACED') {
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.classList.add('valid');
        cell.innerHTML = `<span class="queen queen-pop">${QUEEN_UNICODE}</span>`;

        if (getState().soundEnabled) {
            playBeep(700, 120, 'square'); // click sound
        }
    }
}

/**
 * Mini board (gallery)
 */
export function renderMiniBoard(container, solution, n) {
    container.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    container.innerHTML = '';

    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            const cell = document.createElement('div');
            const isDark = (r + c) % 2 !== 0;

            cell.className = `mini-cell ${isDark ? 'dark' : 'light'}`;
            cell.style.backgroundColor = isDark
                ? 'rgba(255,255,255,0.05)'
                : 'transparent';

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