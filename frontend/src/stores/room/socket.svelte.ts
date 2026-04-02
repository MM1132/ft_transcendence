import { buildWsPath } from '../../utils/constants';
import { navigateTo } from '../router';
import { roomState, resetRoomState } from './state.svelte';
import { handleSocketMessage } from './socketHandlers.svelte';

let socket: WebSocket | null = null;

export function connect(token: string) {
  if (socket) return;

  const wsPath = buildWsPath();
  const ws = new WebSocket(wsPath);
  socket = ws;

  ws.onopen = () => {
    if (socket !== ws) {
      ws.close();
      return;
    }

    roomState.isConnected = true;
    ws.send(JSON.stringify({ event: 'auth', data: { token } }));
    console.log(
      `%c[WebSocket] Connected to ${wsPath}`,
      'color: green; font-weight: bold;'
    );
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    console.log('%c[WS <-]', 'color: cyan; font-weight: bold;', msg);

    handleSocketMessage(msg, {
      roomState,
      navigateTo,
      send,
    });
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
    roomState.isConnected = false;
    roomState.rooms = [];
    roomState.currentRoomId = null;
    roomState.currentRoom = null;
    roomState.currentRoomPlayers = [];
    roomState.currentUserId = null;
    roomState.gameState = null;
    roomState.gameStatus = 'idle';
    if (socket === ws) {
      socket = null;
    }
  };
}

export function send(event: string, data: any) {
  console.log('Sending to WS:', { event, data });
  if (socket?.readyState === WebSocket.OPEN) {
    roomState.roomError = '';
    socket.send(JSON.stringify({ event, data }));
  } else {
    console.error('WebSocket is not connected. Event:', event, 'Data:', data);
  }
}

export async function disconnectRoomSocket(): Promise<void> {
  const roomId = roomState.currentRoomId ? Number(roomState.currentRoomId) : null;

  if (!socket) {
    resetRoomState();
    return;
  }

  const activeSocket = socket;
  socket = null;

  const closePromise = new Promise<void>((resolve) => {
    if (activeSocket.readyState === WebSocket.CLOSED) {
      resolve();
      return;
    }

    activeSocket.addEventListener('close', () => resolve(), { once: true });

    setTimeout(() => resolve(), 250);
  });

  if (activeSocket.readyState === WebSocket.OPEN && roomId) {
    activeSocket.send(
      JSON.stringify({
        event: 'room:leave',
        data: { room_id: roomId },
      })
    );
  }

  if (
    activeSocket.readyState === WebSocket.OPEN ||
    activeSocket.readyState === WebSocket.CONNECTING
  ) {
    activeSocket.close();
  }

  resetRoomState();
  await closePromise;
}

// TODO: for debug
(window as any).wsSend = send;
