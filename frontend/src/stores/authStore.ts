import { writable } from 'svelte/store';
import { authService } from '../services/authService';

type AuthState =
{
    user: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    errorMessage: string;
};

const initialState: AuthState =
{
    user: null,
    isLoggedIn: false,
    isLoading: false,
    errorMessage: ""
};

const { subscribe, update } = writable(initialState);

async function login(username: string, password: string)
{
    const validationError = authService.validateUsername(username);
    if (validationError)
    {
        update((currenState) => ({
            ...currenState, // <== spread operator(copies all existing properties so only change the ones we list)
            errorMessage: validationError
        }));
        return;
    }

    update((currenState) => ({
        ...currenState,
        isLoading: true,
        errorMessage: ""
    }));

    try
    {
        const result = await authService.login(username, password);
        if (result.success)
        {
            update((state) => ({
                ...state,
                isLoggedIn: true,
                user: username,
                isLoading: false
            }));
        }
        else
        {
            update((state) => ({
                ...state,
                isLoggedIn: false,
                user: null,
                errorMessage: result.message,
                isLoading: false
            }));
        }
    }
    catch (e)
    {
        update((state) => ({
            ...state,
            errorMessage: "Connection failed. Is the server running?",
            isLoading: false
        }));
    }
}

export const authStore = { subscribe, login };