import { writable } from 'svelte/store'

export const currentPath = writable<string>(window.location.pathname)
export const selectedProfileUserId = writable<string | null>(null)

const protectedRoutes = ['/dashboard', '/setting', '/work', '/profile', '/room']
let isProtected = protectedRoutes.includes(window.location.pathname)
let protectedPath = isProtected ? window.location.pathname : ''


// Helper to check if a path starts with any of our protected prefixes
const isPathProtected = (path: string) =>
    protectedRoutes.some(route => path.startsWith(route));

export function navigateTo(path: string): void {
    // Only push if the path is actually different to avoid history bloating
    if (window.location.pathname !== path)
    {
        window.history.pushState(null, '', path);
        currentPath.set(path);
    }
    else
    {
        isProtected = false
        protectedPath = ''
        window.history.pushState(null, '', path)
    }
    currentPath.set(path)
}

// Handle browser Close/Refresh navigation This triggers the standard browser "Changes you made may not be saved" popup.
window.addEventListener('beforeunload', (event) => {
    const path = window.location.pathname;
    if (isPathProtected(path)) {
        event.preventDefault();

        // maybe we need it for other browsers to show the prompt
        // event.returnValue = '';
    }
});

// Sync app state with URL when user navigates via browser back/forward buttons
window.addEventListener('popstate', () => {
    const newPath = window.location.pathname;

    // If the user goes 'Back' from /room to /login, the UI updates instantly.
    currentPath.set(newPath);
});