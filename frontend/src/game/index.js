// entry point - wire together :get canvas - initialize game - attach input - start loop

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SNAKE_MOVE_INTERVAL
} from './core/constants.js';
import { createInitialGameState } from './core/gameState.js';
import { createGameLoop } from './core/loop.js';
import { attachInputListeners } from './systems/inputSystem.js';
import { moveSnakeOneStep } from './systems/movementSystem.js';
import { renderGame } from './systems/renderSystem.js';

export function initGame(canvas, options = {}) {
  if (!canvas) {
    throw new Error('initGame: canvas element is required');
  }

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('initGame: could not get 2D rendering context');
  }

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const state = createInitialGameState();

  if (options.debug) {
    state.status = 'running';
  }

  const detachInputListeners = attachInputListeners(state);

  const loop = createGameLoop({
    update(deltaTime) {
      state.debug.frameCount += 1;

      if (deltaTime > 0) {
        state.debug.fps = Math.round(1000 / deltaTime);
      }

      if (state.status !== 'running') {
        return;
      }
      
      state.runtime.accumulator += deltaTime;

      while (state.runtime.accumulator >= SNAKE_MOVE_INTERVAL) {
        moveSnakeOneStep(state);
        state.runtime.accumulator -= SNAKE_MOVE_INTERVAL;
      }
    },
    render() {
      renderGame(ctx, state);
    }
  });

  loop.start();

  return function cleanup() {
    loop.stop();
    detachInputListeners();
  };
}