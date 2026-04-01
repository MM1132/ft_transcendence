import type { Message, RoomState } from './types';
import { normalizeIncomingGameState } from './normalizeGameState';

export interface SocketHandlerDeps {
  roomState: RoomState;
  navigateTo: (path: string) => void;
  send: (event: string, data: any) => void;
}

export function handleSocketMessage(msg: any, deps: SocketHandlerDeps) {
  const { event: type, data } = msg;
  const { roomState, navigateTo, send } = deps;

  console.log('socket.onmessage was called!');

  switch (type) {
    default:
      console.warn('Unhandled WebSocket message type:', type, 'Data:', data);
      break;

    case 'auth:success':
      console.log('✅ Authenticated');
      console.log(roomState.isConnected);
      roomState.currentUserId = data.userId;
      send('chat:history', { room_id: null });
      break;

    case 'room:list':
      roomState.roomError = '';
      roomState.rooms = data;
      console.log(`Loaded ${data.length} rooms`);
      break;

    case 'room:created':
      roomState.roomError = '';
      roomState.rooms = [data.room, ...roomState.rooms];
      roomState.currentRoomId = data.room.id;
      roomState.currentRoom = data.room;
      roomState.currentRoomPlayers = data.players || [];
      roomState.messages = [];
      console.log('Room created! Redirecting to:', data.room.id);
      navigateTo(`/room/${data.room.id}`);
      break;

    case 'room:joined':
      roomState.roomError = '';
      roomState.currentRoomId = data.room.id;
      roomState.currentRoom = data.room;
      roomState.currentRoomPlayers = data.players || [];
      roomState.messages = [];
      navigateTo(`/room/${data.room.id}`);
      break;

    case 'room:error':
      roomState.roomError = data.error ?? 'Room action failed';
      break;

    case 'room:left':
      roomState.roomError = '';
      roomState.currentRoomId = null;
      roomState.currentRoom = null;
      roomState.currentRoomPlayers = [];
      roomState.messages = [];
      roomState.gameState = null;
      roomState.gameStatus = 'idle';
      navigateTo('/dashboard');
      if (data.rooms) roomState.rooms = data.rooms;
      break;

    case 'room:player_joined':
      if (data.user) {
        const newPlayer = { ...data.user, slot: data.slot, is_ready: false };
        roomState.currentRoomPlayers = [...roomState.currentRoomPlayers, newPlayer];
      }
      break;

    case 'room:player_left':
      roomState.currentRoomPlayers = roomState.currentRoomPlayers.filter(
        (p) => p.id !== data.user_id
      );
      break;

    case 'room:player_ready':
      roomState.currentRoomPlayers = roomState.currentRoomPlayers.map((p) => {
        if (p.id === data.user_id) {
          return { ...p, is_ready: data.is_ready };
        }
        return p;
      });
      break;

    case 'room:kicked':
      roomState.roomError = '';
      roomState.currentRoomId = null;
      roomState.currentRoom = null;
      roomState.currentRoomPlayers = [];
      roomState.messages = [];
      roomState.gameState = null;
      roomState.gameStatus = 'idle';
      console.log('%c[SYSTEM] You have been kicked.', 'color: orange;');
      navigateTo('/dashboard');
      break;

    case 'game:start': {
      const normalized = normalizeIncomingGameState(
        data.state ?? data.initial_state ?? data
      );
      roomState.gameState = normalized;
      roomState.gameStatus = 'running';
      roomState.lastGameResult = null;
      console.log('🎮 game:start', normalized);
      break;
    }

    case 'game:state': {
      const normalized = normalizeIncomingGameState(data.state ?? data);
      roomState.gameState = normalized;
      console.log('📡 game:state', normalized);
      break;
    }

    case 'game:end':
      roomState.gameStatus = 'ended';
      roomState.lastGameResult = data;
      roomState.currentRoomPlayers = roomState.currentRoomPlayers.map((player) => ({
        ...player,
        is_ready: false,
      }));
      console.log('🏁 Game ended', data);
      break;

    case 'error':
      console.error('Server error event:', data);
      break;

    case 'user:online':
      console.log(`ℹ️ User online: ${data.userId}`);
      break;

    case 'user:offline':
      console.log(`ℹ️ User offline: ${data.userId}`);
      break;

    case 'chat:message': {
      const newMessage: Message = {
        sender: data.sender,
        content: data.content,
        created_at: data.created_at || new Date().toISOString(),
        room_id: data.room_id,
      };

      if (data.room_id === null) {
        roomState.globalMessages = [...roomState.globalMessages, newMessage];
      } else {
        roomState.messages = [...roomState.messages, newMessage];
      }
      break;
    }

    case 'chat:history': {
      const history: Message[] = (data.messages || []).map((m: any) => ({
        sender: m.sender,
        content: m.content,
        created_at: m.created_at,
        room_id: m.room_id,
      }));

      if (data.room_id === null) {
        roomState.globalMessages = history;
      } else {
        roomState.messages = history;
      }
      break;
    }
  }
}
