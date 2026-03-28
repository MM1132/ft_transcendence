import type { Client } from 'pg';
import { connectionManager } from '../connectionManager.ts';
import type { Direction, GameInputPayload } from '../types.ts';

// ============================================
// Snake Game Types
// ============================================

// TODO:
// - current input model uses relative left/right turns.
//   MVP target uses absolute directions: up/down/left/right.
// - current logic checks collisions between players in one shared arena.
//   MVP target uses isolated per-player boxes, so cross-player collision
//   logic should be removed in a later milestone.

interface Point {
  x: number;
  y: number;
}

interface SnakeState {
  body: Point[]; // Head is body[0]
  direction: Direction;
  nextDirection: Direction; // Buffered input
  score: number;
  alive: boolean;
}

interface SnakeGameState {
  gridWidth: number;
  gridHeight: number;
  snakes: Record<number, SnakeState>; // slot -> snake
  apple: Point;
  gameOver: boolean;
  winnerId: string | null;
  tick: number;
}

interface ActiveSnakeGame {
  gameId: number;
  roomId: number;
  state: SnakeGameState;
  players: Map<string, number>; // userId (userId) -> slot
  intervalId?: ReturnType<typeof setInterval>;
  db: Client;
}

const activeGames: Map<number, ActiveSnakeGame> = new Map();

// Grid settings
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
// const TICK_RATE = 150; // ms between updates (slower = easier)
// TODO return to previous too slow now for debug
const TICK_RATE = 250; // ms between updates (slower = easier)

// ============================================
// Game Input Handler
// ============================================

export async function handleGameInput(
  _db: Client,
  userId: string,
  data: GameInputPayload
): Promise<void> {
  const conn = connectionManager.getConnection(userId);
  if (!conn?.currentRoomId) return;

  const game = activeGames.get(conn.currentRoomId);
  if (!game || game.state.gameOver) return;

  const slot = game.players.get(userId);
  if (slot === undefined) return;

  const snake = game.state.snakes[slot];
  if (!snake || !snake.alive) return;

  const requestedDirection = data.direction;

  // Ignore same-direction change
  if (requestedDirection === snake.direction) return;

  // Prevent 180-degree reversal
  if (isOppositeDirection(requestedDirection, snake.direction)) return;

  console.log('🎮 game input', {
    userId,
    requestedDirection,
    currentDirection: snake.direction,
    nextDirectionBefore: snake.nextDirection,
  });

  snake.nextDirection = requestedDirection;

  console.log('✅ nextDirection updated', {
    userId,
    nextDirectionAfter: snake.nextDirection,
  });
}

function isOppositeDirection(next: Direction, current: Direction): boolean {
  return (
    (next === 'up' && current === 'down') ||
    (next === 'down' && current === 'up') ||
    (next === 'left' && current === 'right') ||
    (next === 'right' && current === 'left')
  );
}

// ============================================
// Start Game
// ============================================

export function startGameLoop(
  db: Client,
  roomId: number,
  gameId: number,
  players: { userId: string; slot: number }[]
): void {
  console.log('🐍🐍🐍 startGameLoop players =', players);
  // Initialize game state
  const state: SnakeGameState = {
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    snakes: {},
    apple: { x: 0, y: 0 },
    gameOver: false,
    winnerId: null,
    tick: 0,
  };

  // all snake spawn(start) from same origin
  const startPosition = {
    x: 3,
    y: Math.floor(GRID_HEIGHT / 2),
    dir: 'right' as Direction,
  };

  const playerMap = new Map<string, number>();

  players.forEach((p) => {
    const pos = startPosition;
    if (!pos) return;
    state.snakes[p.slot] = {
      body: [
        { x: pos.x, y: pos.y },
        {
          x: pos.x - (pos.dir === 'right' ? 1 : pos.dir === 'left' ? -1 : 0),
          y: pos.y - (pos.dir === 'down' ? 1 : pos.dir === 'up' ? -1 : 0),
        },
        {
          x: pos.x - (pos.dir === 'right' ? 2 : pos.dir === 'left' ? -2 : 0),
          y: pos.y - (pos.dir === 'down' ? 2 : pos.dir === 'up' ? -2 : 0),
        },
      ],
      direction: pos.dir,
      nextDirection: pos.dir,
      score: 0,
      alive: true,
    };
    playerMap.set(p.userId, p.slot);
  });

  // Place first apple
  state.apple = spawnApple(state);

  const game: ActiveSnakeGame = {
    gameId,
    roomId,
    state,
    players: playerMap,
    db,
  };

  activeGames.set(roomId, game);

  console.log(`🐍 Snake game started: Room ${roomId}, Game ${gameId}`);

  // Send game:start event with initial state to all players
  // the "contract" shape
  const roomName = `room_${roomId}`;
  console.log('📤 broadcasting game:start', {
    roomId: game.roomId,
    gameId: game.gameId,
    winnerId: state.winnerId,
  });
  connectionManager.broadcast(roomName, 'game:start', {
    game_id: gameId,
    state: {
      box_width: state.gridWidth,
      box_height: state.gridHeight,
      apple: state.apple,
      snakes: Object.fromEntries(
        Object.entries(state.snakes).map(([slot, snake]) => [
          Number(slot),
          {
            body: snake.body,
            direction: snake.direction,
            score: snake.score,
            alive: snake.alive,
          },
        ])
      ),
      tick: 0,
      game_over: state.gameOver,
      winner_id: state.winnerId,
    },
  });

  // Start game loop
  game.intervalId = setInterval(() => {
    updateGame(game);
  }, TICK_RATE);
}

// ============================================
// Game Update Loop
// ============================================

function updateGame(game: ActiveSnakeGame): void {
  if (game.state.gameOver) return;

  const { state } = game;

  state.tick += 1;

  // Update each snake
  const snakeEntries = Object.entries(state.snakes) as [string, SnakeState][];
  for (const [slot, snake] of snakeEntries) {
    if (!snake.alive) continue;

    // Apply buffered direction
    snake.direction = snake.nextDirection;

    // Calculate new head position
    const head = snake.body[0];
    if (!head) continue;
    const newHead = movePoint(head, snake.direction);

    // Check wall collision (optional - wrap around or die)
    if (
      newHead.x < 0 ||
      newHead.x >= state.gridWidth ||
      newHead.y < 0 ||
      newHead.y >= state.gridHeight
    ) {
      snake.alive = false;
      console.log(`🐍 Snake ${slot} hit wall`);
      continue;
    }

    // Check self collision
    if (snake.body.some((p: Point) => p.x === newHead.x && p.y === newHead.y)) {
      snake.alive = false;
      console.log(`🐍 Snake ${slot} hit itself`);
      continue;
    }

    if (!snake.alive) continue;

    // Move snake
    snake.body.unshift(newHead);

    // Check apple collision
    if (newHead.x === state.apple.x && newHead.y === state.apple.y) {
      snake.score += 1;
      console.log(`🍎 Snake ${slot} ate apple! Score: ${snake.score}`);
      state.apple = spawnApple(state);
      // Don't remove tail - snake grows
    } else {
      // Remove tail
      snake.body.pop();
    }
  }

  // Check win condition
  const aliveSnakes = snakeEntries.filter(([, s]) => s.alive);

  if (aliveSnakes.length <= 1) {
    state.gameOver = true;

    if (aliveSnakes.length === 1) {
      // Find winner's userId
      const winner = aliveSnakes[0];
      if (winner) {
        const winnerSlot = parseInt(winner[0], 10);
        for (const [userId, slot] of game.players) {
          if (slot === winnerSlot) {
            state.winnerId = userId;
            break;
          }
        }
      }
    }

    endGame(game);
    return;
  }

  // Broadcast state
  broadcastGameState(game);
}

function movePoint(point: Point, direction: Direction): Point {
  switch (direction) {
    case 'up':
      return { x: point.x, y: point.y - 1 };
    case 'down':
      return { x: point.x, y: point.y + 1 };
    case 'left':
      return { x: point.x - 1, y: point.y };
    case 'right':
      return { x: point.x + 1, y: point.y };
  }
}

function spawnApple(state: SnakeGameState): Point {
  // Get all occupied cells
  const occupied = new Set<string>();
  for (const snake of Object.values(state.snakes)) {
    for (const p of snake.body) {
      occupied.add(`${p.x},${p.y}`);
    }
  }

  // Find empty cell
  const emptyCells: Point[] = [];
  for (let x = 0; x < state.gridWidth; x++) {
    for (let y = 0; y < state.gridHeight; y++) {
      if (!occupied.has(`${x},${y}`)) {
        emptyCells.push({ x, y });
      }
    }
  }

  if (emptyCells.length === 0) {
    // No space - game should end
    return { x: -1, y: -1 };
  }

  const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return cell ?? { x: -1, y: -1 };
}

// ============================================
// Broadcast State
// ============================================

function broadcastGameState(game: ActiveSnakeGame): void {
  const roomName = `room_${game.roomId}`;
  connectionManager.broadcast(roomName, 'game:state', {
    state: {
      box_width: game.state.gridWidth,
      box_height: game.state.gridHeight,
      apple: game.state.apple,
      snakes: Object.fromEntries(
        Object.entries(game.state.snakes).map(([slot, snake]) => [
          Number(slot),
          {
            body: snake.body,
            direction: snake.direction,
            score: snake.score,
            alive: snake.alive,
          },
        ])
      ),
      tick: game.state.tick,
      game_over: game.state.gameOver,
      winner_id: game.state.winnerId,
    },
  });
}

// ============================================
// End Game
// ============================================

/* async function endGame(game: ActiveSnakeGame): Promise<void> {
  // Stop loop
  if (game.intervalId) {
    clearInterval(game.intervalId);
  }

  const { state, db } = game;

  try {
    // Update game in DB
    await db.query(
      `UPDATE games SET status = 'FINISHED', ended_at = NOW() WHERE id = $1`,
      [game.gameId]
    );

    // Calculate coins
    const buyIn = 50; // Could come from room settings
    const coinsChange: Record<string, number> = {};

    for (const [userId, slot] of game.players) {
      const snake = state.snakes[slot];
      if (!snake) continue;

      const isWinner = userId === state.winnerId;
      const score = snake.score;

      // Save result
      await db.query(
        `INSERT INTO game_results (game_id, user_id, score, rank, coins_won)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          game.gameId,
          userId,
          score,
          isWinner ? 1 : 2,
          isWinner ? buyIn : -buyIn,
        ]
      );

      // Update user stats
      if (isWinner) {
        await db.query(
          `UPDATE users SET total_wins = total_wins + 1, coins = coins + $2, total_score = total_score + $3
           WHERE id = $1`,
          [userId, buyIn, score]
        );
        coinsChange[userId] = buyIn;
      } else {
        await db.query(
          `UPDATE users SET total_losses = total_losses + 1, coins = coins - $2, total_score = total_score + $3
           WHERE id = $1`,
          [userId, buyIn, score]
        );
        coinsChange[userId] = -buyIn;
      }
    }

    // Reset room
    await db.query(`UPDATE rooms SET status = 'WAITING' WHERE id = $1`, [
      game.roomId,
    ]);
    await db.query(
      `UPDATE room_players SET is_ready = false WHERE room_id = $1`,
      [game.roomId]
    );

    // Broadcast game end
    const scores: Record<number, number> = {};
    const finalSnakes = Object.entries(state.snakes) as [string, SnakeState][];
    for (const [slot, snake] of finalSnakes) {
      scores[parseInt(slot, 10)] = snake.score;
    }

    connectionManager.broadcast(`room_${game.roomId}`, 'game:end', {
      winner_id: state.winnerId,
      scores,
      coins_change: coinsChange,
    });

    console.log(`🐍 Game ${game.gameId} ended. Winner: ${state.winnerId}`);
  } catch (err) {
    console.error('❌ endGame error:', err);
  } finally {
    activeGames.delete(game.roomId);
  }
} */
// simplified version for now (testing)
async function endGame(game: ActiveSnakeGame): Promise<void> {
  if (game.intervalId) {
    clearInterval(game.intervalId);
  }

  const { state, db } = game;

  try {
    // Mark game finished
    await db.query(
      `UPDATE games
       SET status = 'FINISHED', ended_at = NOW()
       WHERE id = $1`,
      [game.gameId]
    );

    // Reset room back to waiting
    await db.query(
      `UPDATE rooms
       SET status = 'WAITING'
       WHERE id = $1`,
      [game.roomId]
    );

    // Reset ready flags
    await db.query(
      `UPDATE room_players
       SET is_ready = false
       WHERE room_id = $1`,
      [game.roomId]
    );

    // Build final scores by slot
    const scores: Record<number, number> = {};
    const finalSnakes = Object.entries(state.snakes) as [string, SnakeState][];

    for (const [slot, snake] of finalSnakes) {
      scores[parseInt(slot, 10)] = snake.score;
    }

    // MVP: no DB rewards/stats yet
    const coinsChange: Record<string, number> = {};

    // Broadcast game end to everyone in the room
    connectionManager.broadcast(`room_${game.roomId}`, 'game:end', {
      winner_id: state.winnerId,
      scores,
      coins_change: coinsChange,
    });

    console.log(`🐍🛑Game ${game.gameId} ended. Winner: ${state.winnerId}`);
  } catch (err) {
    console.error('❌ endGame error:', err);

    // Even if DB cleanup fails, still try to notify clients
    try {
      const scores: Record<number, number> = {};
      const finalSnakes = Object.entries(state.snakes) as [
        string,
        SnakeState,
      ][];

      for (const [slot, snake] of finalSnakes) {
        scores[parseInt(slot, 10)] = snake.score;
      }

      console.log('📤 broadcasting game:end', {
        roomId: game.roomId,
        winnerId: state.winnerId,
      });
      connectionManager.broadcast(`room_${game.roomId}`, 'game:end', {
        winner_id: state.winnerId,
        scores,
        coins_change: {},
      });

      console.log(
        `⚠️ game:end broadcasted despite DB error. Winner: ${state.winnerId}`
      );
    } catch (broadcastErr) {
      console.error(
        '❌ Failed to broadcast game:end after DB error:',
        broadcastErr
      );
    }
  } finally {
    activeGames.delete(game.roomId);
  }
}

// ============================================
// Disconnect Handler
// ============================================

export function handleGameDisconnect(roomId: number, userId: string): void {
  const game = activeGames.get(roomId);
  if (!game || game.state.gameOver) return;

  const slot = game.players.get(userId);
  if (slot === undefined) return;

  const snake = game.state.snakes[slot];
  if (snake && snake.alive) {
    snake.alive = false;
    console.log(`🐍 Snake ${slot} died (player disconnected)`);
  }

  const aliveSnakes = Object.entries(game.state.snakes).filter(
    ([, snake]) => snake.alive
  );

  if (aliveSnakes.length <= 1) {
    game.state.gameOver = true;

    if (aliveSnakes.length === 1) {
      const firstAlive = aliveSnakes[0];
      if (firstAlive) {
        const winnerSlot = Number(firstAlive[0]);
        for (const [otherUserId, otherSlot] of game.players) {
          if (otherSlot === winnerSlot) {
            game.state.winnerId = otherUserId;
            break;
          }
        }
      }
    }

    void endGame(game);
  }
}

// Export for room handler to use
export { activeGames };
