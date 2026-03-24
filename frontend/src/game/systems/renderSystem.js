// draw current state to canvas

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  COLORS
} from '../core/constants.js';

function clearCanvas(ctx) {
  ctx.fillStyle = COLORS.canvasBackground;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawBoard(ctx, board) {
  const boardWidth = board.cols * board.cellSize;
  const boardHeight = board.rows * board.cellSize;

  ctx.fillStyle = COLORS.boardBackground;
  ctx.fillRect(board.offsetX, board.offsetY, boardWidth, boardHeight);
}

function drawGrid(ctx, board) {
  const boardWidth = board.cols * board.cellSize;
  const boardHeight = board.rows * board.cellSize;

  ctx.strokeStyle = COLORS.gridLine;
  ctx.lineWidth = 1;

  for (let col = 0; col <= board.cols; col += 1) {
    const x = board.offsetX + col * board.cellSize;

    ctx.beginPath();
    ctx.moveTo(x, board.offsetY);
    ctx.lineTo(x, board.offsetY + boardHeight);
    ctx.stroke();
  }

  for (let row = 0; row <= board.rows; row += 1) {
    const y = board.offsetY + row * board.cellSize;

    ctx.beginPath();
    ctx.moveTo(board.offsetX, y);
    ctx.lineTo(board.offsetX + boardWidth, y);
    ctx.stroke();
  }
}

function drawTitle(ctx, state) {
  ctx.fillStyle = COLORS.titleText;
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(state.title, 40, 50);

  ctx.fillStyle = COLORS.subtitleText;
  ctx.font = '16px Arial';
  ctx.fillText(`Status: ${state.status}`, 40, 80);
}

function drawFood(ctx, board, food) {
  if (!food) {
    return;
  }

  const x = board.offsetX + food.x * board.cellSize;
  const y = board.offsetY + food.y * board.cellSize;
  const padding = 4;
  const size = board.cellSize - padding * 2;

  ctx.fillStyle = COLORS.food;
  ctx.fillRect(x + padding, y + padding, size, size);
}

function drawSnake(ctx, board, snake) {
  if (!snake || !snake.segments || snake.segments.length === 0) {
    return;
  }

  snake.segments.forEach((segment, index) => {
    const x = board.offsetX + segment.x * board.cellSize;
    const y = board.offsetY + segment.y * board.cellSize;
    const padding = 2;
    const size = board.cellSize - padding * 2;

    ctx.fillStyle = index === 0 ? COLORS.snakeHead : COLORS.snakeBody;
    ctx.fillRect(x + padding, y + padding, size, size);
  });
}

function drawDebugInfo(ctx, state) {
  ctx.fillStyle = COLORS.debugText;
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';

  ctx.fillText(`Frames: ${state.debug.frameCount}`, 40, 110);
  ctx.fillText(`FPS: ${state.debug.fps}`, 40, 130);
  ctx.fillText(`Accumulator: ${Math.floor(state.runtime.accumulator)} ms`, 40, 150);

  if (state.debug.lastInput) {
    ctx.fillText(`Last input: ${state.debug.lastInput}`, 40, 170);
  }
}

export function renderGame(ctx, state) {
  clearCanvas(ctx);
  drawBoard(ctx, state.board);
  drawGrid(ctx, state.board);
  drawTitle(ctx, state);
  drawFood(ctx, state.board, state.food);

  state.snakes.forEach((snake) => {
    drawSnake(ctx, state.board, snake);
  });

  drawDebugInfo(ctx, state);
}