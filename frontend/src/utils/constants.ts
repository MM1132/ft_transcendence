export const API_ORIGIN = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080')
    .replace(/\/+$/, '')
    .replace(/\/api\/v1$/, '');

export const buildApiPath = (path: string): string => {
    // Normalize VITE_BACKEND_URL once so API paths are always: <origin>/api/v1/<route>.
    // with support to env being missing or already including /api/v1.
    return `${API_ORIGIN}/api/v1${path}`;
}

export const SESSION_STORAGE_KEY = 'auth_session';

export type AuthSessionData = {
    user?: string;
    userId?: string;
    sessionToken?: string;
};
