import { navigateTo } from "./router";

export interface Room {
    id: string;
    name: string;
    creator_id?: string | null;
    maxPlayers: number;
    current_players?: number;
    buy_in_amount?: number;
    time_limit_seconds?: number | null;
    win_condition?: 'BEST_OF' | 'SCORE' | 'TIME';
    status?: 'WAITING' | 'IN_GAME' | 'FINISHED';
    is_permanent?: boolean;
    created_at?: string;
}

// Define the interface for your state
export interface RoomState
{
    rooms: Room[];
    isConnected: boolean;
    currentRoomId: string | null;
}

// Use the interface as a type for $state
export const roomState = $state<RoomState>({
    rooms: [],
    isConnected: false,
    currentRoomId: null
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
        const { event: type, data } = msg;

        switch (type) {
             default:
                console.warn("Unhandled WebSocket message type:", type, "Data:", data);
                break;

            case 'auth:success':
                console.log("✅ Authenticated");
                console.log(roomState.isConnected);
                // send('room:list', {});
                break;

            case 'room:list':
                roomState.rooms = data;
                console.log(`Loaded ${data.length} rooms`);
                break;
                
            case 'room:created':
                roomState.rooms = [data.room, ...roomState.rooms];
                break;

            // case 'room:update':
            //     // Update players count or status in real-time
            //     const idx = roomState.rooms.findIndex(r => r.id === data.id);
            //     if (idx !== -1) roomState.rooms[idx] = data;
            //     break;

            case 'room:joined':
                roomState.currentRoomId = data.room.id;
                break;
            
            case 'room:left' :
                roomState.currentRoomId = null;
                navigateTo('/dashboard');
                if (data.rooms)
                    roomState.rooms = data.rooms;
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