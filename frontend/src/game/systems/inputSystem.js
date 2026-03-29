// handle keyboard input and turns it into game actions

import { resetGameState } from '../core/gameState.js';

const KEY_TO_DIRECTION = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right'
};

export function attachInputListeners(state) {
  function handleKeyDown(event) {
    // START GAME
    if (event.key === 'Enter') {
      if (state.status === 'idle') {
        state.status = 'running';
      }
      return;
    }

    // PAUSE / UNPAUSE
    if (event.key === 'p' || event.key === 'P') {
      if (state.status === 'running') {
        state.status = 'paused';
      } else if (state.status === 'paused') {
        state.status = 'running';
      }
      return;
    }

    // RESTART
    if (event.key === 'r' || event.key === 'R') {
      if (state.status === 'game_over') {
        event.preventDefault();
        resetGameState(state);
      }
      return;
    }

    const direction = KEY_TO_DIRECTION[event.key];

    if (!direction) return;

    event.preventDefault();

    state.debug.lastInput = direction;

    const snake = state.snakes[0];

    if (snake && state.status === 'running') {
      snake.pendingDirection = direction;
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return function detachInputListeners() {
    window.removeEventListener('keydown', handleKeyDown);
  };
}