// Tetris game using p5.js

const COLS = 10;
const ROWS = 20;
const BLOCK = 30;
const BOARD_X = 40;
const BOARD_Y = 40;

let board;
let currentPiece;
let fallInterval = 500;
let lastFall = 0;
let score = 0;
let linesCleared = 0;
let level = 1;
let gameOver = false;

// Tetromino shapes and colors
const PIECES = [
  { shape: [[1,1,1,1]],                         color: [0,240,240] },   // I - cyan
  { shape: [[1,1],[1,1]],                        color: [240,240,0] },   // O - yellow
  { shape: [[0,1,0],[1,1,1]],                    color: [160,0,240] },   // T - purple
  { shape: [[1,0,0],[1,1,1]],                    color: [0,0,240] },     // J - blue
  { shape: [[0,0,1],[1,1,1]],                    color: [240,160,0] },   // L - orange
  { shape: [[0,1,1],[1,1,0]],                    color: [0,240,0] },     // S - green
  { shape: [[1,1,0],[0,1,1]],                    color: [240,0,0] },     // Z - red
];

function setup() {
  createCanvas(BOARD_X * 2 + COLS * BLOCK + 120, BOARD_Y * 2 + ROWS * BLOCK);
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  spawnPiece();
}

function draw() {
  background(30);

  if (!gameOver && millis() - lastFall > fallInterval) {
    movePiece(0, 1);
    lastFall = millis();
  }

  drawBoard();
  drawPiece();
  drawUI();

  if (gameOver) {
    fill(255, 0, 0);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("GAME OVER", BOARD_X + (COLS * BLOCK) / 2, BOARD_Y + (ROWS * BLOCK) / 2);
    textSize(16);
    text("Press R to restart", BOARD_X + (COLS * BLOCK) / 2, BOARD_Y + (ROWS * BLOCK) / 2 + 40);
  }
}

function drawBoard() {
  // Border
  stroke(100);
  noFill();
  rect(BOARD_X - 1, BOARD_Y - 1, COLS * BLOCK + 2, ROWS * BLOCK + 2);

  // Cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let x = BOARD_X + c * BLOCK;
      let y = BOARD_Y + r * BLOCK;
      if (board[r][c]) {
        fill(board[r][c]);
        stroke(40);
        rect(x, y, BLOCK, BLOCK, 3);
      } else {
        fill(20);
        stroke(35);
        rect(x, y, BLOCK, BLOCK);
      }
    }
  }
}

function drawPiece() {
  if (!currentPiece || gameOver) return;
  let { shape, color: col, x, y } = currentPiece;
  fill(col);
  stroke(40);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        rect(BOARD_X + (x + c) * BLOCK, BOARD_Y + (y + r) * BLOCK, BLOCK, BLOCK, 3);
      }
    }
  }
}

function drawUI() {
  let panelX = BOARD_X + COLS * BLOCK + 30;
  fill(220);
  noStroke();
  textSize(20);
  textAlign(LEFT, TOP);
  text("TETRIS", panelX, BOARD_Y);
  textSize(14);
  text("Score: " + score, panelX, BOARD_Y + 40);
  text("Lines: " + linesCleared, panelX, BOARD_Y + 65);
  text("Level: " + level, panelX, BOARD_Y + 90);
  textSize(11);
  fill(150);
  text("← → Move", panelX, BOARD_Y + 140);
  text("↑ Rotate", panelX, BOARD_Y + 160);
  text("↓ Soft drop", panelX, BOARD_Y + 180);
  text("Space Hard drop", panelX, BOARD_Y + 200);
  text("R Restart", panelX, BOARD_Y + 220);
}

function spawnPiece() {
  let p = random(PIECES);
  currentPiece = {
    shape: p.shape.map(row => [...row]),
    color: p.color,
    x: floor((COLS - p.shape[0].length) / 2),
    y: 0,
  };
  if (collides(currentPiece.shape, currentPiece.x, currentPiece.y)) {
    gameOver = true;
  }
}

function collides(shape, px, py) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      let nr = py + r;
      let nc = px + c;
      if (nc < 0 || nc >= COLS || nr >= ROWS) return true;
      if (nr >= 0 && board[nr][nc]) return true;
    }
  }
  return false;
}

function lockPiece() {
  let { shape, color: col, x, y } = currentPiece;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        let nr = y + r;
        if (nr >= 0) board[nr][x + c] = col;
      }
    }
  }
  clearLines();
  spawnPiece();
}

function clearLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== 0)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(0));
      cleared++;
      r++; // recheck same row
    }
  }
  if (cleared > 0) {
    const points = [0, 100, 300, 500, 800];
    score += (points[cleared] || 800) * level;
    linesCleared += cleared;
    level = floor(linesCleared / 10) + 1;
    fallInterval = max(100, 500 - (level - 1) * 40);
  }
}

function movePiece(dx, dy) {
  let { shape, x, y } = currentPiece;
  if (!collides(shape, x + dx, y + dy)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    return true;
  }
  if (dy > 0) lockPiece();
  return false;
}

function rotatePiece() {
  let { shape, x, y } = currentPiece;
  let rotated = shape[0].map((_, c) => shape.map(row => row[c]).reverse());

  for (let offset of [0, -1, 1, -2, 2]) {
    if (!collides(rotated, x + offset, y)) {
      currentPiece.shape = rotated;
      currentPiece.x += offset;
      return;
    }
  }
}

function hardDrop() {
  while (movePiece(0, 1)) { score += 2; }
}

function keyPressed() {
  if (gameOver) {
    if (key === 'r' || key === 'R') restartGame();
    return;
  }
  if (keyCode === LEFT_ARROW)  movePiece(-1, 0);
  if (keyCode === RIGHT_ARROW) movePiece(1, 0);
  if (keyCode === DOWN_ARROW)  { movePiece(0, 1); score += 1; }
  if (keyCode === UP_ARROW)    rotatePiece();
  if (key === ' ')             hardDrop();
  if (key === 'r' || key === 'R') restartGame();
}

function restartGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  score = 0;
  linesCleared = 0;
  level = 1;
  fallInterval = 500;
  gameOver = false;
  spawnPiece();
}
