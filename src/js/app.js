import { getState, setState, getDelay } from './state.js';
import { stepSolveNQueens } from './solver/stepSolver.js';
import { solveNQueens } from './solver/nQueens.js';
import { initBoard, updateBoard, renderMiniBoard } from './ui/board.js';
import { setupControls, updateSolveButton, updateStatsDisplay } from './ui/controls.js';
import { initStats, updateSolverStats } from './ui/stats.js';
import { setupTheme } from './ui/theme.js';
import { delay, formatSolution } from './utils/helpers.js';

async function init() {
    // 1. Initial State Setup
    const { n } = getState();
    
    // 2. Component Initialization
    setupTheme();
    setupMobileMenu();
    injectBackgroundBlobs();
    setupScrollReveal();
    setupBackToTop();
    initBoard(n);
    initStats();
    setupControls(handleSolve, handleReset);
    
    // 3. Hide Loader
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1000);

    // 4. Hero Animation (Optional teaser)
    startHeroTeaser();
}

async function handleSolve() {
    const { n, isSolving } = getState();
    if (isSolving) return;

    const startTime = Date.now();
    
    setState({ 
        isSolving: true, 
        cancelSolving: false, 
        solutions: [], 
        backtracks: 0,
        startTime: startTime
    });
    updateSolveButton(true);

    const solver = stepSolveNQueens(n);
    const gallerySection = document.getElementById('gallery');
    const solutionsContainer = document.getElementById('solutions-container');
    const gallerySummary = document.getElementById('gallery-summary');
    
    solutionsContainer.innerHTML = '';
    gallerySection.classList.add('hidden');

    let solutionCount = 0;
    let lastBacktracks = 0;
    
    for (const step of solver) {
        const { cancelSolving, speed, isPaused } = getState();
        if (cancelSolving) break;

        // Handle pause
        while (isPaused) {
            await delay(100);
        }

        updateBoard(step);
        
        if (step.type === 'FOUND_SOLUTION') {
            solutionCount++;
            const formatted = formatSolution(step.queens, n);
            addSolutionToGallery(formatted, n);
            gallerySection.classList.remove('hidden');
            gallerySummary.textContent = `Found ${solutionCount} solution(s) for N=${n}`;
            triggerSuccessEffect();
        }
        
        if (step.backtrackCount !== undefined) {
            lastBacktracks = step.backtrackCount;
            const timeElapsed = Date.now() - startTime;
            updateStatsDisplay(solutionCount, lastBacktracks, timeElapsed);
        }

        // Wait based on speed (except for instant)
        if (speed !== 'instant') {
            await delay(getDelay());
        }
    }

    setState({ isSolving: false });
    updateSolveButton(false);
    
    const timeElapsed = Date.now() - startTime;
    updateStatsDisplay(solutionCount, lastBacktracks, timeElapsed);
    
    // Final results if instant
    if (getState().speed === 'instant' && !getState().cancelSolving) {
        const final = solveNQueens(n);
        updateStatsDisplay(final.count, 0, timeElapsed);
        solutionsContainer.innerHTML = '';
        final.solutions.forEach(sol => addSolutionToGallery(sol, n));
        gallerySection.classList.remove('hidden');
        gallerySummary.textContent = `Found ${final.count} solutions for N=${n}`;
    }
}

function handleReset() {
    const { n } = getState();
    initBoard(n);
    document.getElementById('solver-stats').classList.add('hidden');
    document.getElementById('gallery').classList.add('hidden');
}

function addSolutionToGallery(solution, n) {
    const solutionsContainer = document.getElementById('solutions-container');
    
    const card = document.createElement('div');
    card.className = 'glass-card solution-card fade-in';
    
    const miniBoard = document.createElement('div');
    miniBoard.className = 'mini-grid';
    renderMiniBoard(miniBoard, solution, n);
    
    const codeBlock = document.createElement('div');
    codeBlock.className = 'solution-code';
    codeBlock.innerHTML = `<pre style="font-size: 0.75rem; color: var(--text-secondary)">[${solution.map(s => `"${s}"`).join(',\n ')}]</pre>`;
    
    card.appendChild(miniBoard);
    card.appendChild(codeBlock);
    solutionsContainer.appendChild(card);
}

function startHeroTeaser() {
    const miniBoard = document.getElementById('hero-mini-board');
    if (!miniBoard) return;
    
    // Simple 4x4 animated loop for the hero section
    const solutions = [
        ["#Q##", "###Q", "Q###", "##Q#"],
        ["##Q#", "Q###", "###Q", "#Q##"]
    ];
    let current = 0;

    const render = () => {
        miniBoard.style.gridTemplateColumns = `repeat(4, 1fr)`;
        miniBoard.innerHTML = '';
        const sol = solutions[current];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const cell = document.createElement('div');
                cell.className = `cell ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
                if (sol[r][c] === 'Q') {
                    cell.innerHTML = `<span class="queen queen-pop">♛</span>`;
                }
                miniBoard.appendChild(cell);
            }
        }
        current = (current + 1) % solutions.length;
    };

    render();
    setInterval(render, 3000);
}

function setupMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('mobile-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('hidden');
        toggle.classList.toggle('active');
    });

    // Close menu when link is clicked
    nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            nav.classList.add('hidden');
            toggle.classList.remove('active');
        }
    });
}

function injectBackgroundBlobs() {
    const blob1 = document.createElement('div');
    blob1.className = 'blob';
    blob1.style.top = '-10%';
    blob1.style.left = '-10%';
    
    const blob2 = document.createElement('div');
    blob2.className = 'blob';
    blob2.style.bottom = '-10%';
    blob2.style.right = '-10%';
    blob2.style.animationDelay = '-5s';
    blob2.style.background = 'radial-gradient(circle, var(--accent-gold-glow) 0%, transparent 70%)';

    document.body.appendChild(blob1);
    document.body.appendChild(blob2);
}

function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve after revealing
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    revealElements.forEach(el => observer.observe(el));
}

function setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function triggerSuccessEffect() {
    const board = document.getElementById('main-board-container');
    board.classList.add('success-ripple');
    setTimeout(() => {
        board.classList.remove('success-ripple');
    }, 1000);
}

document.addEventListener('DOMContentLoaded', init);
