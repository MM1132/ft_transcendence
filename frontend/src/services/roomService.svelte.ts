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
            currentPlayers: 4,
            maxPlayers: 5,
            entryFee: 10
        },
        {
            id: '2',
            name: 'Second Room',
            currentPlayers: 4,
            maxPlayers: 4,
            entryFee: 5
        },
        {
            id: '3',
            name: 'Third Room',
            currentPlayers: 6,
            maxPlayers: 14,
            entryFee: 254
        },
        {
            id: '4',
            name: 'Foor Room',
            currentPlayers: 3,
            maxPlayers: 4,
            entryFee: 105
        },
        {
            id: '5',
            name: '5 Room',
            currentPlayers: 1,
            maxPlayers: 8,
            entryFee: 5
        },
        {
            id: '6',
            name: '6 Room',
            currentPlayers: 7,
            maxPlayers: 8,
            entryFee: 456
        },
        {
            id: '7',
            name: 'Test Room',
            currentPlayers: 2,
            maxPlayers: 4,
            entryFee: 10
        },
        {
            id: '8',
            name: '8 Room',
            currentPlayers: 1,
            maxPlayers: 7,
            entryFee: 5
        },
        {
            id: '9',
            name: '9 Room',
            currentPlayers: 1,
            maxPlayers: 7,
            entryFee: 254
        },
        {
            id: '10',
            name: 'Test Room',
            currentPlayers: 4,
            maxPlayers: 4,
            entryFee: 10
        },
        {
            id: '11',
            name: 'Second Room',
            currentPlayers: 4,
            maxPlayers: 4,
            entryFee: 5
        },
        {
            id: '12',
            name: 'Third Room',
            currentPlayers: 1,
            maxPlayers: 7,
            entryFee: 254
        },
        {
            id: '13',
            name: 'Foor Room',
            currentPlayers: 3,
            maxPlayers: 4,
            entryFee: 105
        },
        {
            id: '14',
            name: '5 Room',
            currentPlayers: 1,
            maxPlayers: 8,
            entryFee: 5
        },
        {
            id: '15',
            name: '6 Room',
            currentPlayers: 7,
            maxPlayers: 7,
            entryFee: 24
        },
        {
            id: '16',
            name: 'Test Room',
            currentPlayers: 2,
            maxPlayers: 4,
            entryFee: 10
        },
        {
            id: '17',
            name: '8 Room',
            currentPlayers: 1,
            maxPlayers: 7,
            entryFee: 5
        },
        {
            id: '18',
            name: '9 Room',
            currentPlayers: 1,
            maxPlayers: 7,
            entryFee: 254
        }
    ])
}