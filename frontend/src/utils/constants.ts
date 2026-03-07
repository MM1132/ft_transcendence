export const buildApiPath = (path: string): string => {
 // * VITE_BACKEND_URL missing/already include /api/vi -> normalize once so final API paths are always: <origin>/api/v1/<route>
    const backendOrigin = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080')
        .replace(/\/+$/, '')
        .replace(/\/api\/v1$/, '');
    return `${backendOrigin}/api/v1${path}`;
}

// VITE_BACKEND_URL missing -> undefined/api/v1/user/me/settings/avatar (connection error)
// VITE_BACKEND_URL=http://localhost:8080/api/v1 -> http://localhost:8080/api/v1/api/v1/user/me/settings/avatar (404)
