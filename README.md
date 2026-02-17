# Tetris — p5.js

A classic Tetris game built with [p5.js](https://p5js.org/). No build tools required — just open `index.html` in a browser and play.

## How to Play

| Key | Action |
|-----|--------|
| ← → | Move piece left / right |
| ↑ | Rotate piece |
| ↓ | Soft drop (+1 point per row) |
| Space | Hard drop (+2 points per row) |
| R | Restart game |

## Scoring

| Lines Cleared | Points (× level) |
|---------------|-------------------|
| 1 | 100 |
| 2 | 300 |
| 3 | 500 |
| 4 | 800 |

The level increases every 10 lines cleared, and pieces fall faster with each level.

## Running

Open `index.html` in any modern browser. p5.js is loaded from a CDN, so an internet connection is needed on first load.

## Tech

- **p5.js 1.9.0** for rendering and game loop
- Vanilla JavaScript, no dependencies to install
