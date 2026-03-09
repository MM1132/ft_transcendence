const API_URL = 'http://localhost:8080/api/v1';

export interface Room
{
    id: string;
    name: string;
    currentPlayers: number;
    maxPlayers: number;
    entryFee: number;
};

const initialState: Room = 
{
    id: '',
    name: '',
    currentPlayers: 0,
    maxPlayers: 0,
    entryFee: 0
};

export type UpdateRoomsPayload = 
{
    currentPlayers?: number;
    maxPlayers?: number;
};

// Hardcoding the list of rooms
export async function getAllRooms(): Promise<Room[]>
{
    return Promise.resolve([
        {
            id: '1',
            name: 'Test Room',
            currentPlayers: 2,
            maxPlayers: 4,
            entryFee: 10
        },
        {
            id: '2',
            name: 'Second Room',
            currentPlayers: 4,
            maxPlayers: 4,
            entryFee: 5
        }
    ])
}