// entry point - wire together :get canvas - initialize game - attach input - start loop

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SNAKE_MOVE_INTERVAL
} from './core/constants.js';
import { createInitialGameState, resetGameState } from './core/gameState.js';
import { createGameLoop } from './core/loop.js';
import { attachInputListeners } from './systems/inputSystem.js';
import { moveSnakeOneStep } from './systems/movementSystem.js';
import { renderGame } from './systems/renderSystem.js';
import { createSocketClient } from './multiplayer/socketClient.js';
import {
  applyGameStart,
  applyGameState,
  applyGameEnd
} from './multiplayer/stateSync.js';

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

  const mode = options.mode ?? 'local';
  const state = createInitialGameState();

  let socketClient = null;

  if (mode === 'multiplayer') {
    state.status = 'idle';
  }

  function handleLocalStart() {
    if (mode === 'local') {
      state.status = 'running';
    }
  }

  function handleLocalPauseToggle() {
    if (mode !== 'local') {
      return;
    }

    if (state.status === 'running') {
      state.status = 'paused';
    } else if (state.status === 'paused') {
      state.status = 'running';
    }
  }

  function handleLocalRestart() {
    if (mode === 'local') {
      resetGameState(state);
    }
  }

  function handleDirectionInput(direction) {
    if (mode === 'multiplayer') {
      if (!socketClient) {
        return;
      }

      if (state.status !== 'running') {
        return;
      }

      socketClient.send('game:input', { direction });
      return;
    }

    const snake = state.snakes[0];

    if (snake && state.status === 'running') {
      snake.pendingDirection = direction;
    }
  }

  const detachInputListeners = attachInputListeners({
    state,
    mode,
    onDirectionInput: handleDirectionInput,
    onStart: handleLocalStart,
    onPauseToggle: handleLocalPauseToggle,
    onRestart: handleLocalRestart
  });

  if (mode === 'multiplayer') {
    const wsUrl = options.wsUrl;

    if (!wsUrl) {
      throw new Error('initGame: wsUrl is required in multiplayer mode');
    }

    socketClient = createSocketClient({
      url: wsUrl,
      onOpen() {
        console.log('[WS] connected');

        if (options.token) {
          socketClient.authenticate(options.token);
        }
      },
      onClose(event) {
        console.log('[WS] closed', event);
      },
      onError(event) {
        console.error('[WS] error', event);
      },
      onMessage(message) {
        console.log('[WS] message', message);

        switch (message.event) {
          case 'auth:success': {
            if (options.roomId) {
              socketClient.send('room:join', { room_id: options.roomId });
            }
            break;
          }

          case 'room:joined':
          case 'room:created':
          case 'room:player_joined':
          case 'room:player_left':
          case 'room:player_ready': {
            // Lobby-related UI can hook here later.
            break;
          }

          case 'game:start': {
            applyGameStart(state, message.data);
            break;
          }

          case 'game:state': {
            applyGameState(state, message.data);
            break;
          }

          case 'game:end': {
            applyGameEnd(state, message.data);
            break;
          }

          case 'auth:error':
          case 'room:error':
          case 'game:error': {
            console.error('[WS] server error event', message);
            break;
          }

          default: {
            console.log('[WS] unhandled event', message.event, message.data);
          }
        }
      }
    });

    socketClient.connect();
  }

  const loop = createGameLoop({
    update(deltaTime) {
      state.debug.frameCount += 1;

      if (deltaTime > 0) {
        state.debug.fps = Math.round(1000 / deltaTime);
      }

      if (mode === 'multiplayer') {
        return;
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

    if (socketClient) {
      socketClient.disconnect();
    }
  };
}