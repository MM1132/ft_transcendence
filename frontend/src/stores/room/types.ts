export type Direction = 'up' | 'down' | 'left' | 'right';

export interface SnakePoint {
  x: number;
  y: number;
}

export interface SnakeSnapshot {
  body: SnakePoint[];
  direction: Direction;
  score: number;
  alive: boolean;
}

export interface MultiplayerSnakeState {
  box_width: number;
  box_height: number;
  apple: SnakePoint;
  snakes: Record<number, SnakeSnapshot>;
  tick: number;
  game_over: boolean;
  winner_id: string | null;
}

export interface Room {
  id: string;
  name: string;
  creator_id?: string | null;
  max_players: number;
  current_players?: number;
  buy_in_amount?: number;
  time_limit_seconds?: number | null;
  win_condition?: 'BEST_OF' | 'SCORE' | 'TIME';
  status?: 'WAITING' | 'IN_GAME' | 'FINISHED';
  is_permanent?: boolean;
  created_at?: string;
}

export interface Message {
  sender: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  content: string;
  created_at: string;
  room_id: string | null;
}

export interface RoomState {
  rooms: Room[];
  isConnected: boolean;
  roomError: string;
  currentRoomId: string | null;
  currentRoom?: Room | null;
  currentRoomPlayers?: Player[];
  currentUserId?: string | null;
  gameState?: MultiplayerSnakeState | null;
  gameStatus?: 'idle' | 'running' | 'ended';
  lastGameResult?: LastGameResult | null;
  globalMessages: Message[];
  messages: Message[];
}

export interface Player {
  id: string;
  username: string;
  avatar_url: string | null;
  slot: number;
  is_ready: boolean;
}

export interface LastGameResult {
  winner_id: string | null;
  scores: Record<number, number>;
  coins_change: Record<string, number>;
}
