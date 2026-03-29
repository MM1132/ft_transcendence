import { get, writable } from 'svelte/store';
import { authService } from '../services/authService';
import { navigateTo } from './router';
import { SESSION_STORAGE_KEY, type AuthSessionData } from '../utils/constants';
import { disconnectRoomSocket } from './roomStore.svelte';

type AuthState =
{
    user: string | null;
    userId: string | null;
    sessionToken: string | null;
    balance: number | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    errorMessage: string;
};

const initialState: AuthState =
{
    user: null,
    userId: null,
    sessionToken: null,
    balance: null,
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

    const passError = authService.validatePassword(password);
    if (passError)
    {
        update((currenState) => ({
            ...currenState, 
            errorMessage: passError
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
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: username, userId: result.userId, sessionToken: result.sessionToken }));
            const myUser = result.sessionToken ? await authService.getMyUser(result.sessionToken) : null;
            update((state) => ({
                ...state,
                isLoggedIn: true,
                user: username,
                userId: result.userId,
                sessionToken: result.sessionToken,
                balance: myUser?.balance ?? null,
                isLoading: false
            }));
        }
        else
        {
            update((state) => ({
                ...state,
                isLoggedIn: false,
                user: null,
                balance: null,
                errorMessage: result.message,
                isLoading: false
            }));
        }
    }
    catch (e)
    {
        update((state) => ({
            ...state,
            balance: null,
            errorMessage: "Connection failed. Is the server running?",
            isLoading: false
        }));
    }
}


async   function signup(username: string, password: string, email: string)
{
    const usernameError = authService.validateUsername(username);
    if(usernameError)
    {
        update((state) => ({
            ...state,
            errorMessage: usernameError
        }));
        return;
    }

    const passwordError = authService.validatePassword(password);
    if(passwordError)
    {
        update((state) => ({
            ...state,
            errorMessage: passwordError
        }));
        return;
    }

    const emailError = authService.validateEmail(email);
    if(emailError)
    {
        update((state) => ({
            ...state,
            errorMessage: emailError
        }));
        return;
    }

    update((state) => ({
        ...state,
        isLoading: true,
        errorMessage: ""
    }));

    try
    {
        const result = await authService.signup(username, password, email);
        if(result.success)
        {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: username, userId: result.userId, sessionToken: result.sessionToken }));
            const myUser = result.sessionToken ? await authService.getMyUser(result.sessionToken) : null;
            update((state) => ({
                ...state,
                isLoggedIn: true,
                user: username,
                userId: result.userId,
                sessionToken: result.sessionToken,
                balance: myUser?.balance ?? null,
                isLoading: false
            }));
        }
        else
        {
            update((state) => ({
                ...state,
                isLoggedIn: false,
                user: null,
                userId: null,
                sessionToken: null,
                balance: null,
                errorMessage: result.message,
                isLoading: false
            }));
        }   
    }
    catch(e)
    {
        update((state) => ({
            ...state,
            balance: null,
            errorMessage: "Connection failed. Is the server running?",
            isLoading: false
        }));
    }
}


function initFromSession()
{
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return;

    try
    {
        const parsed = JSON.parse(raw) as AuthSessionData;

        if (!parsed.user || !parsed.userId || !parsed.sessionToken)
        {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
            return;
        }

        update((state) => ({
            ...state,
            user: parsed.user,
            userId: parsed.userId,
            sessionToken: parsed.sessionToken,
            isLoggedIn: true,
            balance: null,
            errorMessage: ""
        }));

        void authService.getMyUser(parsed.sessionToken).then((user) => {
            if (!user || user.id !== parsed.userId)
            {
                logout();
                return;
            }

            update((state) => ({
                ...state,
                balance: user.balance
            }));
        });
    }
    catch (_error)
    {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
}

async function logout()
{
    await disconnectRoomSocket();
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    update(() => ({ ...initialState }));
    navigateTo('/');
}

function setBalance(balance: number | null)
{
    update((state) => ({
        ...state,
        balance
    }));
}

function getCurrentUserId(): string
{
    const { userId } = get({ subscribe });
    if (!userId)
        throw new Error('Current user id is not available');

    return userId;
}

export const authStore = { subscribe, login, signup, logout, initFromSession, getCurrentUserId, setBalance };
