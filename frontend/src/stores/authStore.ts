import { writable } from 'svelte/store';
import { authService } from '../services/authService';

type AuthState =
{
    user: string | null;
    userId: string | null;
    sessionToken: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    errorMessage: string;
};

const initialState: AuthState =
{
    user: null,
    userId: null,
    sessionToken: null,
    isLoggedIn: false,
    isLoading: false,
    errorMessage: ""
};

const { subscribe, update } = writable(initialState);
const SESSION_STORAGE_KEY = 'auth_session';

async function login(username: string, password: string)
{
    const usernameValidationError = authService.validateUsername(username);
    if (usernameValidationError)
    {
        update((currenState) => ({
            ...currenState, // <== spread operator(copies all existing properties so only change the ones we list)
            errorMessage: usernameValidationError
        }));
        return;
    }

    const passwordValidationError = authService.validatePassword(password);
    if (passwordValidationError)
    {
        update((currenState) => ({
            ...currenState,
            errorMessage: passwordValidationError
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
            sessionStorage.setItem(
                SESSION_STORAGE_KEY,
                JSON.stringify({
                    user: username,
                    userId: result.userId,
                    sessionToken: result.sessionToken
                })
            );

            update((state) => ({
                ...state,
                isLoggedIn: true,
                user: username,
                userId: result.userId,
                sessionToken: result.sessionToken,
                isLoading: false
            }));
        }
        else
        {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);

            update((state) => ({
                ...state,
                isLoggedIn: false,
                user: null,
                userId: null,
                sessionToken: null,
                errorMessage: result.message,
                isLoading: false
            }));
        }
    }
    catch (e)
    {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);

        update((state) => ({
            ...state,
            isLoggedIn: false,
            user: null,
            userId: null,
            sessionToken: null,
            errorMessage: "Connection failed. Is the server running?",
            isLoading: false
        }));
    }
}

function logout()
{
    sessionStorage.removeItem(SESSION_STORAGE_KEY);

    update(() => ({
        ...initialState
    }));
}

// function getAuthHeaders()
// {
//     const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
//     if (!raw) return {};

//     try
//     {
//         const parsed = JSON.parse(raw) as { sessionToken?: string };
//         if (!parsed.sessionToken) return {};

//         return {
//             'x-session-token': parsed.sessionToken
//         };
//     }
//     catch (_error)
//     {
//         return {};
//     }
// }

function initFromSession()
{
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return;

    try
    {
        const parsed = JSON.parse(raw) as {
            user?: string;
            userId?: string;
            sessionToken?: string;
        };

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
            errorMessage: ""
        }));

        void authService.getMyUser(parsed.sessionToken).then((user) => {
            if (!user || user.id !== parsed.userId)
            {
                logout();
            }
        });
    }
    catch (_error)
    {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
}

// export const authStore = { subscribe, login, logout, initFromSession, getAuthHeaders };
export const authStore = { subscribe, login, logout, initFromSession };
