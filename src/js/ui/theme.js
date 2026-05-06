import { getState, setState } from '../state.js';

export function setupTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    if (!themeBtn) return;

    // Load saved theme or default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    // Toggle theme
    themeBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        applyTheme(newTheme);
    });
}

function applyTheme(theme) {
    const html = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');

    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setState({ theme });

    // 🔥 Update button visual state
    if (themeBtn) {
        themeBtn.classList.toggle('light', theme === 'light');
        themeBtn.classList.toggle('dark', theme === 'dark');
    }
}