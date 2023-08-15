import { writable } from "svelte/store";
import { defaultTheme, getSchemes } from "./theme";

export const webAppStore = writable(null as any);
export const themeStore = writable(defaultTheme);
export const userDataStore = writable(null as UserData | null);

export function updateWebAppStore() {
  webAppStore.set(window.Telegram.WebApp);
}

export function updateThemeStore(webapp: any) {
  if (webapp?.themeParams?.button_color) themeStore.set(getSchemes(webapp?.themeParams.button_color, webapp?.colorScheme === "dark"));
  else themeStore.set(defaultTheme);
}
