export const API_ORIGIN = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080')
    .replace(/\/+$/, '');

export const buildApiPath = (path: string): string => {
    // We assume backend returns consistent paths and VITE_BACKEND_URL is the base URL.
    return `${API_ORIGIN}/api/v1${path}`;
}

export const buildWsPath = (): string => {
    const url = new URL(API_ORIGIN);
    const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
    
    return `${wsProtocol}//${url.host}/ws`;
}

export const SESSION_STORAGE_KEY = 'auth_session';

export type AuthSessionData = {
    user?: string;
    userId?: string;
    sessionToken?: string;
};
