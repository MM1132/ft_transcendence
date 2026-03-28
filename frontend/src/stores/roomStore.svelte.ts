import { navigateTo } from "./router";

/* TODO for missing handlers:

game:start
game:state
game:end */

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

export interface Room
{
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

export interface RoomState
{
    rooms: Room[];
    isConnected: boolean;
    currentRoomId: string | null;
    currentRoom?: Room | null;
    currentRoomPlayers?: Player[];
    currentUserId?: string | null;
    gameState?: MultiplayerSnakeState | null;
    gameStatus?: 'idle' | 'starting' | 'running' | 'ended';
}

export interface Player
{
    id: string;
    username: string;
    avatar_url: string | null;
    slot: number;
    is_ready: boolean;
}

export const roomState = $state<RoomState>({
    rooms: [],
    isConnected: false,
    currentRoomId: null,
    currentRoom: null,
    currentRoomPlayers: [],
    currentUserId: null,
    gameState: null,
    gameStatus: 'idle'
});

let socket: WebSocket | null = null;

export function connect(token: string)
{
    if (socket) return; // Prevent multiple connections

    socket = new WebSocket('ws://localhost:8080/ws');

    socket.onopen = () => {
        roomState.isConnected = true;
        send('auth', { token });
        console.log("%c[WebSocket] Connected to ws://localhost:8080/ws", "color: green; font-weight: bold;");
    };

    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log('%c[WS <-]', 'color: cyan; font-weight: bold;', msg);

        const { event: type, data } = msg;

        switch (type) {
             default:
                console.warn("Unhandled WebSocket message type:", type, "Data:", data);
                break;

            case 'auth:success':
                console.log("✅ Authenticated");
                console.log(roomState.isConnected);
                roomState.currentUserId = data.userId; // we set the user ID from backend
                break;

            case 'room:list':
                roomState.rooms = data;
                console.log(`Loaded ${data.length} rooms`);
                break;
                
            case 'room:created':
                roomState.rooms = [data.room, ...roomState.rooms];
                
                roomState.currentRoomId = data.room.id;
                roomState.currentRoom = data.room;
                roomState.currentRoomPlayers = data.players || [];
                
                console.log("Room created! Redirecting to:", data.room.id);
                navigateTo(`/room/${data.room.id}`);
                break;

            case 'room:joined':
                roomState.currentRoomId = data.room.id;
                roomState.currentRoom = data.room;
                roomState.currentRoomPlayers = data.players || [];
                navigateTo(`/room/${data.room.id}`);
                break;
            
            case 'room:left' :
                roomState.currentRoomId = null;
                roomState.currentRoom = null;
                roomState.currentRoomPlayers = [];
                roomState.gameState = null;
                roomState.gameStatus = 'idle';
                navigateTo('/dashboard');
                if (data.rooms)
                    roomState.rooms = data.rooms;
                break;

            case 'room:player_joined':
                if(data.user)
                {
                    const newPlayer = {...data.user, slot: data.slot, is_ready: false};
                    roomState.currentRoomPlayers = [...roomState.currentRoomPlayers, newPlayer];
                }
                break;

            case 'room:player_left':
                roomState.currentRoomPlayers = roomState.currentRoomPlayers.filter( p => p.id !== data.user_id);
                break;

            case 'room:player_ready':
                roomState.currentRoomPlayers = roomState.currentRoomPlayers.map(p => {
                    if (p.id === data.user_id)
                    {
                        return { ...p, is_ready: data.is_ready };
                    }
                    return p;
                });
                break;

            case 'room:kicked':
                    roomState.currentRoomId = null;
                    roomState.currentRoom = null;
                    roomState.currentRoomPlayers = [];
                    roomState.gameState = null;
                    roomState.gameStatus = 'idle';
                    console.log("%c[SYSTEM] You have been kicked.", "color: orange;");
                    navigateTo('/dashboard');
                break;

            case 'game:start':
                    roomState.gameState = data.state;
                    roomState.gameStatus = 'running';
                    console.log('🎮 game:start', data);
                    console.log('roomState.gameState =', roomState.gameState);
                    console.log('roomState.gameStatus =', roomState.gameStatus);
                break;

            case 'game:state':
                    roomState.gameState = data.state;
                    console.log('📡 game:state', data);
                    console.log('roomState.gameState =', roomState.gameState);
                    console.log('roomState.gameStatus =', roomState.gameStatus);
                break;

            case 'game:end':
                    roomState.gameStatus = 'ended';
                    console.log('🏁 Game ended', data);
                break;

            case 'error':
                    console.error("Server error event:", data);
                break;
        }
    };

    socket.onclose = () => {
        console.log("WebSocket closed");
            roomState.isConnected = false;
            roomState.rooms = [];
            roomState.currentRoomId = null;
            roomState.currentRoom = null;
            roomState.currentRoomPlayers = [];
            roomState.currentUserId = null;
            roomState.gameState = null;
            roomState.gameStatus = 'idle';
            socket = null;
    };
}

export function send(event: string, data: any)
{
     console.log("Sending to WS:", { event, data });
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({event,data}));
    } 
    else
    {
        console.error("WebSocket is not connected.Event:", event, "Data:", data);
    }
}
// TODO: for debug
(window as any).wsSend = send;

function resetRoomState() {
    roomState.isConnected = false;
    roomState.currentRoomId = null;
    roomState.currentRoom = null;
    roomState.currentRoomPlayers = [];
    roomState.currentUserId = null;
    roomState.gameState = null;
    roomState.gameStatus = 'idle';
}

// TODO: call it at logout button / logout action:
// disconnect helper as to release rooms when players are out
export async function disconnectRoomSocket(): Promise<void> {
    const roomId = roomState.currentRoomId
        ? Number(roomState.currentRoomId)
        : null;

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

        activeSocket.addEventListener(
            'close',
            () => resolve(),
            { once: true }
        );

        // fallback in case close event does not arrive in time
        setTimeout(() => resolve(), 250);
    });

    if (activeSocket.readyState === WebSocket.OPEN && roomId) {
        activeSocket.send(
            JSON.stringify({
                event: 'room:leave',
                data: { room_id: roomId }
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