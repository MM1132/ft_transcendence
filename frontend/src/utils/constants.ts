export const buildApiPath = (path: string): string => {
    return `${import.meta.env.VITE_BACKEND_URL}/api/v1${path}`;
}
