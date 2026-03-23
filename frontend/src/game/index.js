// entry point - wire together :get canvas - initialize game - attach input - start loop

import { CANVAS_WIDTH, CANVAS_HEIGHT } from './core/constants.js';
import { createInitialGameState } from './core/gameState.js';
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
    state.status = 'ready';
  }

  state.debug.frameCount += 1;
  renderGame(ctx, state);

  return function cleanup() {
    // TODO 
    // nothing to clean up yet.
    // Later this will stop loops, remove listeners, close sockets, etc.
  };
}