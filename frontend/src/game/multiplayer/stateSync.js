// converts incoming backend state into frontend updates -> translator/adapter

/* take backend payloads
normalize them into frontend state shape
update your game state object cleanly */

// backend snake shape -> frontend renderer shape
function getSnakeColor(slot) {
  const palette = {
    1: '#22c55e',
    2: '#3b82f6',
    3: '#f59e0b',
    4: '#ef4444'
  };

  return palette[slot] ?? '#ffffff';
}

function normalizeSnakes(serverSnakes) {
  return Object.entries(serverSnakes).map(([slotKey, snake]) => {
    const slot = Number(slotKey);

    return {
      id: snake.user_id ?? `slot-${slot}`,
      slot,
      segments: snake.body,
      direction: snake.direction,
      pendingDirection: snake.nextDirection,
      score: snake.score,
      alive: snake.alive,
      color: getSnakeColor(slot)
    };
  });
}

function buildScores(snakes) {
  const scores = {};

  snakes.forEach((snake) => {
    scores[snake.id] = snake.score;
  });

  return scores;
}

export function normalizeServerState(serverState) {
  const snakes = normalizeSnakes(serverState.snakes);

  return {
    status: serverState.gameOver ? 'game_over' : 'running',
    board: {
      cols: serverState.gridWidth,
      rows: serverState.gridHeight
    },
    snakes,
    food: serverState.apple,
    scores: buildScores(snakes),
    winnerId: serverState.winnerId ?? null,
    lastServerTick: serverState.tick ?? 0
  };
}

export function applyGameStart(state, payload) {
  const normalized = normalizeServerState(payload.initial_state);

  state.status = normalized.status;
  state.board.cols = normalized.board.cols;
  state.board.rows = normalized.board.rows;
  state.snakes = normalized.snakes;
  state.food = normalized.food;
  state.scores = normalized.scores;
  state.winnerId = normalized.winnerId;
  state.debug.lastServerTick = normalized.lastServerTick;
  state.runtime.accumulator = 0;
}

export function applyGameState(state, payload) {
  const normalized = normalizeServerState(payload.state);

  state.status = normalized.status;
  state.board.cols = normalized.board.cols;
  state.board.rows = normalized.board.rows;
  state.snakes = normalized.snakes;
  state.food = normalized.food;
  state.scores = normalized.scores;
  state.winnerId = normalized.winnerId;
  state.debug.lastServerTick = normalized.lastServerTick;
}

export function applyGameEnd(state, payload) {
  state.status = 'game_over';
  state.winnerId = payload.winner_id ?? null;
}