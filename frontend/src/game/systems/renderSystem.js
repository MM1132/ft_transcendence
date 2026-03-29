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

function drawScore(ctx, state) {
  const localPlayerId = 'local-player';
  const score = state.scores[localPlayerId] ?? 0;

  ctx.fillStyle = COLORS.debugText;
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 40, 200);
}

function drawGameOverOverlay(ctx, state) {
  if (state.status !== 'game_over') {
    return;
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = COLORS.titleText;
  ctx.font = 'bold 42px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

  ctx.fillStyle = COLORS.subtitleText;
  ctx.font = '20px Arial';
  ctx.fillText('Press R to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
}

function drawCenteredText(ctx, text, y, size = 24, color = '#fff') {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(text, CANVAS_WIDTH / 2, y);
}

function drawStartOverlay(ctx, state) {
  if (state.status !== 'idle') return;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawCenteredText(ctx, 'Online Snake', CANVAS_HEIGHT / 2 - 40, 42);
  drawCenteredText(ctx, 'Press ENTER to start', CANVAS_HEIGHT / 2 + 10, 20);
}

function drawPauseOverlay(ctx, state) {
  if (state.status !== 'paused') return;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawCenteredText(ctx, 'Paused', CANVAS_HEIGHT / 2, 36);
  drawCenteredText(ctx, 'Press P to resume', CANVAS_HEIGHT / 2 + 40, 18);
}

export function renderGame(ctx, state) {
  clearCanvas(ctx);
  drawBoard(ctx, state.board);
  drawGrid(ctx, state.board);
  // drawTitle(ctx, state);
  drawFood(ctx, state.board, state.food);

  state.snakes.forEach((snake) => {
    drawSnake(ctx, state.board, snake);
  });

  drawScore(ctx, state);
  // drawDebugInfo(ctx, state);

  drawStartOverlay(ctx, state);
  drawPauseOverlay(ctx, state);
  drawGameOverOverlay(ctx, state);
}