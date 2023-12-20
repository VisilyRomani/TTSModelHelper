import { writable } from "svelte/store";

export const audioFiles = writable<{ name?: string; path: string }[]>([]);
