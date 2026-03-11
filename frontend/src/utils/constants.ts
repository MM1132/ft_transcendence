export const buildApiPath = (path: string): string => {
    // Normalize VITE_BACKEND_URL once so API paths are always: <origin>/api/v1/<route>.
    // with support to env being missing or already including /api/v1.
    const backendOrigin = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080')
        .replace(/\/+$/, '')
        .replace(/\/api\/v1$/, '');
    return `${backendOrigin}/api/v1${path}`;
}
