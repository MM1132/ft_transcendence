import { writable } from 'svelte/store'

export const currentPath = writable<string>(window.location.pathname)

export function navigateTo(path: string): void
{
    window.history.replaceState(null, '', path) 
    currentPath.set(path)
}
