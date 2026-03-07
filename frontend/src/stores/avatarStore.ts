import { writable } from 'svelte/store';

export const avatarStore = writable<string | null>(null);
