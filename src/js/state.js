import { SPEED_MAP } from './utils/constants.js';

let state = {
    n: 4,
    speed: 'normal',
    mode: 'auto',
    isSolving: false,
    solutions: [],
    currentStep: 0,
    backtracks: 0,
    theme: 'dark',
    cancelSolving: false,
    soundEnabled: true,
    isPaused: false,
    stepCounter: 0,
    startTime: null,
    currentSolution: 0
};

const listeners = [];

export const getState = () => ({ ...state });

export const setState = (newState) => {
    state = { ...state, ...newState };
    notifyListeners();
};

export const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
    };
};

const notifyListeners = () => {
    listeners.forEach(listener => listener(state));
};

export const getDelay = () => SPEED_MAP[state.speed] || 300;
