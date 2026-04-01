import type { RoomState } from './types';

export const roomState = $state<RoomState>({
  rooms: [],
  isConnected: false,
  roomError: '',
  currentRoomId: null,
  currentRoom: null,
  currentRoomPlayers: [],
  currentUserId: null,
  gameState: null,
  gameStatus: 'idle',
  lastGameResult: null,
  globalMessages: [],
  messages: [],
});

export function resetRoomState() {
  roomState.isConnected = false;
  roomState.currentRoomId = null;
  roomState.currentRoom = null;
  roomState.currentRoomPlayers = [];
  roomState.messages = [];
  roomState.currentUserId = null;
  roomState.gameState = null;
  roomState.gameStatus = 'idle';
}
