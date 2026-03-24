// holds the game state shape

import {
  BOARD_COLS,
  BOARD_ROWS,
  CELL_SIZE,
  BOARD_OFFSET_X,
  BOARD_OFFSET_Y,
  GAME_TITLE
} from './constants.js';

export function createInitialGameState() {
  return {
    title: GAME_TITLE,
    status: 'ready',
    board: {
      cols: BOARD_COLS,
      rows: BOARD_ROWS,
      cellSize: CELL_SIZE,
      offsetX: BOARD_OFFSET_X,
      offsetY: BOARD_OFFSET_Y
    },
    snakes: [
      {
        id: 'local-player',
        segments: [
          { x: 5, y: 5 },
          { x: 4, y: 5 },
          { x: 3, y: 5 }
        ],
        direction: 'right',
        pendingDirection: 'right',
        color: 'green',
        alive: true
      }
    ],
    food: {
      x: 12,
      y: 8
    },
    scores: {
      'local-player': 0
    },
    runtime: {
      accumulator: 0
    },
    debug: {
      fps: 0,
      frameCount: 0,
      lastInput: null
    }
  };
}