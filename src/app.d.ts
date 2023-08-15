// See https://kit.svelte.dev/docs/types#app

import type TelegramBot from "node-telegram-bot-api";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  interface Window {
    Telegram: {
      WebView: unknown;
      Utils: unknown;
      WebApp: Record<string, unknown>;
    };
  }

  interface Group extends TelegramBot.Chat {
    members: TelegramBot.User[];
  }
  interface UserData {
    user: TelegramBot.User;
    groups: Group[];
  }
}

export {};
