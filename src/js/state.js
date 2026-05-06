// import { SPEED_MAP } from './utils/constants.js';

// let state = {
//     n: 4,
//     speed: 'normal',
//     mode: 'auto',
//     isSolving: false,
//     solutions: [],
//     currentStep: 0,
//     backtracks: 0,
//     theme: 'dark',
//     cancelSolving: false,
//     soundEnabled: true,
//     isPaused: false,
//     stepCounter: 0,
//     startTime: null,
//     currentSolution: 0
// };

// const listeners = [];

// export const getState = () => ({ ...state });

// export const setState = (newState) => {
//     state = { ...state, ...newState };
//     notifyListeners();
// };

// export const subscribe = (listener) => {
//     listeners.push(listener);
//     return () => {
//         const index = listeners.indexOf(listener);
//         if (index > -1) listeners.splice(index, 1);
//     };
// };

// const notifyListeners = () => {
//     listeners.forEach(listener => listener(state));
// };

// export const getDelay = () => SPEED_MAP[state.speed] || 300;



import { SPEED_MAP } from './utils/constants.js';

// ===============================
// 🧠 Global State
// ===============================
let state = {
    n: 4,
    speed: 'normal',
    mode: 'auto',

    isSolving: false,
    cancelSolving: false,
    isPaused: false,

    solutions: [],
    currentSolution: 0,

    currentStep: 0,
    stepCounter: 0,
    backtracks: 0,

    startTime: null,

    theme: 'dark',
    soundEnabled: true
};

// ===============================
// 📡 Subscribers (Reactive system)
// ===============================
const listeners = [];

// ===============================
// 📦 Get State (safe copy)
// ===============================
export const getState = () => ({ ...state });

// ===============================
// ✏️ Update State
// ===============================
export const setState = (newState) => {
    state = { ...state, ...newState };
    notifyListeners();
};

// ===============================
// 🔔 Subscribe to changes
// ===============================
export const subscribe = (listener) => {
    if (typeof listener !== 'function') return;

    listeners.push(listener);

    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
    };
};

// ===============================
// 🔄 Notify all listeners
// ===============================
const notifyListeners = () => {
    listeners.forEach(listener => listener(getState())); // ✅ send safe copy
};

// ===============================
// ⚡ Speed delay helper
// ===============================
export const getDelay = () => {
    return SPEED_MAP[state.speed] ?? 300;
};

// ===============================
// 🔄 Reset State (very useful)
// ===============================
export const resetState = () => {
    state = {
        ...state,
        isSolving: false,
        cancelSolving: false,
        isPaused: false,

        solutions: [],
        currentSolution: 0,

        currentStep: 0,
        stepCounter: 0,
        backtracks: 0,

        startTime: null
    };

    notifyListeners();
};