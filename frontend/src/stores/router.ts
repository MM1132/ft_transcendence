import { writable } from 'svelte/store'

export const currentPath = writable<string>(window.location.pathname)
export const selectedProfileUserId = writable<string | null>(null)

export function navigateTo(path: string): void {
    // Only push if the path is actually different to avoid history bloating
    if (window.location.pathname !== path)
    {
        window.history.pushState(null, '', path);
        currentPath.set(path);
    }
    else
    {
        window.history.pushState(null, '', path)
    }
    currentPath.set(path)
}

// Sync app state with URL when user navigates via browser back/forward buttons
window.addEventListener('popstate', () => {
    const newPath = window.location.pathname;
    currentPath.set(newPath);
});