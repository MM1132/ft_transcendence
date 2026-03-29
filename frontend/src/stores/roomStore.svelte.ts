import { buildWsPath, buildWsPath } from "../utils/constants";
import { navigateTo } from "./router";

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

export interface RoomState {
    rooms: Room[];
    isConnected: boolean;
    currentRoomId: string | null;
    currentRoom?: Room | null;
    currentRoomPlayers?: Player[];
    currentUserId?: string | null;
    currentUserName?: string | null;
}

export interface Player {
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
    currentUserName: null,
});

let socket: WebSocket | null = null;

export function connect(token: string) {
    if (socket) return; // Prevent multiple connections

    const wsPath = buildWsPath();
    socket = new WebSocket(wsPath);

    socket.onopen = () => {
        roomState.isConnected = true;
        send('auth', { token });
        console.log(`%c[WebSocket] Connected to ${wsPath}", "color: green; font-weight: bold;`);
    };

    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const { event: type, data } = msg;

        console.log("socket.onmessage was called!")
        console.log(`Username: ${data}`);

        switch (type) {
            default:
                console.warn("Unhandled WebSocket message type:", type, "Data:", data);
                break;

            case 'auth:success':
                console.log("✅ Authenticated");
                console.log(roomState.isConnected);
                roomState.currentUserId = data.userId; // we set the user ID from backend
                roomState.currentUserName = data.username;
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

            case 'room:left':
                roomState.currentRoomId = null;
                navigateTo('/dashboard');
                if (data.rooms)
                    roomState.rooms = data.rooms;
                break;

            case 'room:player_joined':
                if (data.user) {
                    const newPlayer = { ...data.user, slot: data.slot, is_ready: false };
                    roomState.currentRoomPlayers = [...roomState.currentRoomPlayers, newPlayer];
                }
                break;

            case 'room:player_left':
                roomState.currentRoomPlayers = roomState.currentRoomPlayers.filter(p => p.id !== data.user_id);
                break;

            case 'room:player_ready':
                roomState.currentRoomPlayers = roomState.currentRoomPlayers.map(p => {
                    if (p.id === data.user_id) {
                        return { ...p, is_ready: data.is_ready };
                    }
                    return p;
                });
                break;

            case 'room:kicked':
                roomState.currentRoomId = null;
                roomState.currentRoom = null;
                roomState.currentRoomPlayers = [];
                console.log("%c[SYSTEM] You have been kicked.", "color: orange;");
                navigateTo('/dashboard');
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
        socket = null;
    };
}

export function send(event: string, data: any) {
    console.log("Sending to WS:", { event, data });
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ event, data }));
    }
    else {
        console.error("WebSocket is not connected.Event:", event, "Data:", data);
    }
}