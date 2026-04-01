import type { MultiplayerSnakeState } from './types';

export function normalizeIncomingGameState(raw: any): MultiplayerSnakeState | null {
  if (!raw) return null;

  // Already in the new shape
  if (
    typeof raw.box_width === 'number' &&
    typeof raw.box_height === 'number' &&
    raw.apple &&
    raw.snakes
  ) {
    return {
      box_width: raw.box_width,
      box_height: raw.box_height,
      apple: raw.apple,
      snakes: raw.snakes,
      tick: raw.tick ?? 0,
      game_over: raw.game_over ?? false,
      winner_id: raw.winner_id ?? null,
    };
  }

  // Backward-compatible fallback for older payloads
  if (
    typeof raw.gridWidth === 'number' &&
    typeof raw.gridHeight === 'number' &&
    raw.apple &&
    raw.snakes
  ) {
    return {
      box_width: raw.gridWidth,
      box_height: raw.gridHeight,
      apple: raw.apple,
      snakes: raw.snakes,
      tick: raw.tick ?? 0,
      game_over: raw.gameOver ?? false,
      winner_id: raw.winnerId ?? null,
    };
  }

  return null;
}
