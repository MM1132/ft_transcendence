// Re-export types
export type {
  Direction,
  SnakePoint,
  SnakeSnapshot,
  MultiplayerSnakeState,
  Room,
  Message,
  Player,
  LastGameResult,
  RoomState,
} from './room/types';

// Re-export state
export { roomState } from './room/state.svelte';

// Re-export socket functions
export { connect, send, disconnectRoomSocket } from './room/socket.svelte';

/* TODO for missing handlers:

game:start
game:state
game:end */
