import { writable } from "svelte/store";

export const webAppStore = writable(null as any);

export function updateWebAppStore() {
  webAppStore.set(window.Telegram.WebApp);
}
