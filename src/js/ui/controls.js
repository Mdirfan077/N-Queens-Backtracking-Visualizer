import { getState, setState } from '../state.js';
import { initBoard } from './board.js';
import { unlockAudio } from './board.js';
export function setupControls(onSolve, onReset) {
    const nInput = document.getElementById('n-input');
    const nValue = document.getElementById('n-value');
    const speedInput = document.getElementById('speed-input');
    const modeInput = document.getElementById('mode-input');
    const solveBtn = document.getElementById('solve-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const nextStepBtn = document.getElementById('next-step-btn');
    const resetBtn = document.getElementById('reset-btn');

    // 🔔 Toast helper
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.getElementById('toast-container').appendChild(toast);

        setTimeout(() => toast.remove(), 2000);
    }

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const n = parseInt(e.target.dataset.preset);
            nInput.value = n;
            nValue.textContent = n;
            setState({ n });
            initBoard(n);
            updatePresetButtons();
            onReset();
            showToast(`Board set to ${n}x${n}`);
        });
    });

    updatePresetButtons();

    nInput.addEventListener('input', (e) => {
        const n = parseInt(e.target.value);
        nValue.textContent = n;
        setState({ n });
        initBoard(n);
        updatePresetButtons();
        onReset();
    });

    speedInput.addEventListener('change', (e) => {
        setState({ speed: e.target.value });
        showToast(`Speed: ${e.target.value}`);
    });

    modeInput.addEventListener('change', (e) => {
        setState({ mode: e.target.value });
        const n = parseInt(nInput.value);
        initBoard(n);
        onReset();
        showToast(`Mode: ${e.target.value}`);
    });

   solveBtn.addEventListener('click', () => {

        // 🔊 unlock sound safely
        unlockAudio();

        const { isSolving } = getState();

        if (isSolving) {
            setState({ cancelSolving: true });
            showToast('Stopping solver...');
        } else {
            showToast('Solving started...');
            onSolve();
        }
    });

    // Pause button
    pauseBtn.addEventListener('click', () => {
        const { isPaused } = getState();
        setState({ isPaused: !isPaused });

        pauseBtn.querySelector('span').textContent = isPaused ? '⏸ Pause' : '▶ Resume';
        showToast(isPaused ? 'Resumed' : 'Paused');
    });

    // Step button
    nextStepBtn.addEventListener('click', () => {
        const { stepCounter } = getState();
        setState({ stepCounter: stepCounter + 1 });
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        const { isSolving } = getState();
        if (isSolving) {
            setState({ cancelSolving: true });
        }
        onReset();
        showToast('Board reset');
    });

    // 🔊 Sound toggle
    document.getElementById('sound-toggle').addEventListener('click', (e) => {
        const { soundEnabled } = getState();
        setState({ soundEnabled: !soundEnabled });

        e.target.classList.toggle('active');
        showToast(soundEnabled ? 'Sound OFF 🔇' : 'Sound ON 🔊');
    });

    // Help modal
    document.getElementById('help-btn').addEventListener('click', () => {
        document.getElementById('shortcuts-modal').classList.remove('hidden');
    });

    // Export
    document.getElementById('export-btn').addEventListener('click', () => {
        exportSolutions();
        showToast('Solutions exported');
    });

    // Modal close
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.modal:not(.hidden)')) return;

        switch(e.key) {
            case ' ':
                e.preventDefault();
                solveBtn.click();
                break;
            case 'r':
            case 'R':
                resetBtn.click();
                break;
            case 's':
            case 'S':
                document.getElementById('sound-toggle').click();
                break;
            case 'ArrowRight':
                nextStepBtn.click();
                break;
        }
    });
}

function updatePresetButtons() {
    const { n } = getState();
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.preset) === n);
    });
}

export function updateSolveButton(isSolving) {
    const solveBtn = document.getElementById('solve-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const nextStepBtn = document.getElementById('next-step-btn');
    const btnText = solveBtn.querySelector('.btn-text');
    const spinner = solveBtn.querySelector('.loading-spinner');
    const { mode } = getState();

    if (isSolving) {
        btnText.textContent = 'Stop Solving';
        spinner.classList.remove('hidden');
        solveBtn.classList.add('btn-danger');

        if (mode === 'step') {
            pauseBtn.classList.remove('hidden');
            nextStepBtn.classList.remove('hidden');
        }
    } else {
        btnText.textContent = 'Solve Now';
        spinner.classList.add('hidden');
        solveBtn.classList.remove('btn-danger');
        pauseBtn.classList.add('hidden');
        nextStepBtn.classList.add('hidden');
        pauseBtn.querySelector('span').textContent = '⏸ Pause';
    }
}

export function updateStatsDisplay(solutions, backtracks, timeElapsed) {
    const panel = document.getElementById('solver-stats');
    panel.classList.remove('hidden');

    document.getElementById('solution-count').textContent = solutions;
    document.getElementById('backtrack-count').textContent = backtracks;
    document.getElementById('time-elapsed').textContent =
        (timeElapsed / 1000).toFixed(1) + 's';

    const opsPerSec =
        timeElapsed > 0
            ? Math.round((solutions + backtracks) / (timeElapsed / 1000))
            : 0;

    document.getElementById('ops-per-sec').textContent =
        opsPerSec.toLocaleString();
}

function exportSolutions() {
    const { solutions, n } = getState();

    if (solutions.length === 0) {
        alert('No solutions to export.');
        return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'N,' + n + '\n';
    csvContent += 'Total Solutions,' + solutions.length + '\n\n';
    csvContent += 'Solution #,Configuration\n';

    solutions.forEach((sol, idx) => {
        csvContent += `${idx + 1},"${JSON.stringify(sol)}"\n`;
    });

    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `nqueens-${n}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}