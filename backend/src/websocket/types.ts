import type { WebSocket } from '@fastify/websocket';

// ============================================
// WebSocket Event Types
// ============================================

// Client -> Server Events
export type ClientEvent =
  | 'auth'
  | 'room:join'
  | 'room:leave'
  | 'room:ready'
  | 'room:create'
  | 'room:kick'
  | 'room:invite'
  | 'chat:send'
  | 'chat:history'
  | 'game:input'
  | 'friend:request'
  | 'friend:accept'
  | 'friend:decline';

// Server -> Client Events
export type ServerEvent =
  | 'auth:success'
  | 'auth:error'
  | 'error'
  | 'room:list'
  | 'room:joined'
  | 'room:created'
  | 'room:left'
  | 'room:player_joined'
  | 'room:player_left'
  | 'room:player_ready'
  | 'room:error'
  | 'chat:message'
  | 'chat:history'
  | 'game:start'
  | 'game:state'
  | 'game:end'
  | 'user:online'
  | 'user:offline'
  | 'friend:request_received'
  | 'friend:request_sent'
  | 'friend:accepted'
  | 'friend:declined'
  | 'room:kicked'
  | 'room:invite_received';

// ============================================
// Message Payloads
// ============================================

export interface WSMessage<T = unknown> {
  event: ClientEvent | ServerEvent;
  data: T;
}

// Auth
export interface AuthPayload {
  token: string;
}

export interface AuthSuccessPayload {
  userId: string;
  username: string;
}

// Room Events
export interface RoomCreatePayload {
  name: string;
  max_players: number; // 2-4
  buy_in_amount?: number;
  time_limit_seconds?: number;
  win_condition?: 'BEST_OF' | 'SCORE' | 'TIME';
}

export interface RoomJoinPayload {
  room_id: number;
}

export interface RoomLeavePayload {
  room_id: number;
}

export interface RoomReadyPayload {
  room_id: number;
}

export interface RoomKickPayload {
  room_id: number;
  target_user_id: string;
}

export interface RoomInvitePayload {
  room_id: number;
  target_user_id: string;
}

export interface RoomJoinedPayload {
  room: RoomData;
  players: PlayerData[];
  your_slot: number;
}

export interface PlayerJoinedPayload {
  user: UserBasicData;
  slot: number;
}

export interface PlayerLeftPayload {
  user_id: string;
  slot: number;
}

export interface PlayerReadyPayload {
  user_id: string;
  is_ready: boolean;
}

// Chat Events
export interface ChatSendPayload {
  room_id: number | null; // null = global chat
  content: string;
}

export interface ChatHistoryPayload {
  room_id: number | null;
  limit?: number;
}

export interface ChatMessagePayload {
  id: number;
  sender: UserBasicData;
  room_id: number | null;
  content: string;
  created_at: string;
}

// Game Events
export interface GameInputPayload {
  direction: 'left' | 'right';
}

export interface GameStartPayload {
  game_id: number;
  initial_state: GameState;
}

export interface GameStatePayload {
  ball: { x: number; y: number; vx: number; vy: number };
  paddles: Record<number, { y: number }>; // slot -> paddle position
  scores: Record<number, number>; // slot -> score
}

export interface GameEndPayload {
  winner_id: number;
  scores: Record<number, number>;
  coins_change: Record<number, number>; // user_id -> coins delta
}

// Friend Events (Placeholder)
export interface FriendRequestPayload {
  target_user_id: string;
}

export interface FriendResponsePayload {
  request_id: number;
}

// ============================================
// Data Types
// ============================================

export interface UserBasicData {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface PlayerData extends UserBasicData {
  slot: number;
  is_ready: boolean;
}

export interface RoomData {
  id: number;
  name: string;
  max_players: number;
  status: 'WAITING' | 'IN_GAME';
  is_permanent: boolean;
  creator_id: string | null;
  current_players: number;
}

export interface GameState {
  ball: { x: number; y: number; vx: number; vy: number };
  paddles: Record<number, { y: number }>;
  scores: Record<number, number>;
}

// ============================================
// Connection Types
// ============================================

export interface AuthenticatedSocket {
  socket: WebSocket;
  userId: string;
  username: string;
  currentRoomId: number | null;
}
