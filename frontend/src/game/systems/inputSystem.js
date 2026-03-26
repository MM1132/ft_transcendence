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

export function attachInputListeners({
  state,
  mode = 'local',
  onDirectionInput,
  onStart,
  onPauseToggle,
  onRestart
}) {
  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      if (state.status === 'idle') {
        event.preventDefault();

        if (typeof onStart === 'function') {
          onStart();
        } else {
          state.status = 'running';
        }
      }
      return;
    }

    if (event.key === 'p' || event.key === 'P') {
      if (state.status === 'running' || state.status === 'paused') {
        event.preventDefault();

        if (typeof onPauseToggle === 'function') {
          onPauseToggle();
        } else if (state.status === 'running') {
          state.status = 'paused';
        } else if (state.status === 'paused') {
          state.status = 'running';
        }
      }
      return;
    }

    if (event.key === 'r' || event.key === 'R') {
      if (state.status === 'game_over') {
        event.preventDefault();

        if (typeof onRestart === 'function') {
          onRestart();
        } else {
          resetGameState(state);
        }
      }
      return;
    }

    const direction = KEY_TO_DIRECTION[event.key];

    if (!direction) {
      return;
    }

    event.preventDefault();
    state.debug.lastInput = direction;

    if (typeof onDirectionInput === 'function') {
      onDirectionInput(direction);
      return;
    }

    if (mode === 'local') {
      const snake = state.snakes[0];

      if (snake && state.status === 'running') {
        snake.pendingDirection = direction;
      }
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return function detachInputListeners() {
    window.removeEventListener('keydown', handleKeyDown);
  };
}