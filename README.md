# N-Queens Visualizer

A premium, interactive web application to visualize the backtracking algorithm for the N-Queens problem.

## Features
- **Live Visualizer**: Watch the backtracking algorithm explore solutions step-by-step.
- **Adjustable Board**: Supports N=1 to N=9.
- **Speed Control**: Choose between Slow, Normal, Fast, and Instant solving modes.
- **Solutions Gallery**: View all valid configurations found during the solving process.
- **Stats Comparison**: View a table of total vs unique solutions for different N sizes.
- **Glassmorphism Design**: High-end dark theme with smooth animations and responsive layout.

## Tech Stack
- **HTML5**: Semantic structure.
- **Vanilla CSS**: Custom design system and animations.
- **Vanilla JavaScript**: ES Modules (no dependencies).
- **Backtracking Algorithm**: Depth-first search with conflict detection.

## How to Use
1. Clone or download the repository.
2. Open `index.html` in a modern web browser.
3. Select a board size using the slider.
4. Click **Solve Now** to start the visualization.
5. Scroll down to see the full gallery of found solutions.

## File Structure
- `index.html`: Main entry point.
- `src/styles/`: CSS design system and animations.
- `src/js/`: JavaScript logic divided into modules (solver, ui, utils).
- `src/assets/`: UI assets like icons.

## Problem Statement
The N-Queens puzzle is the problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other. A solution requires that no two queens share the same row, column, or diagonal.
