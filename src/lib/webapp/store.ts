import type TelegramBot from "node-telegram-bot-api";
import { writable } from "svelte/store";

export const webAppStore = writable(null as any);
export const stateStore = writable({
  phase: -1,
  user: null,
  groups: null,
  group: null,
  paymentInformation: null,
  splitInformation: null,
  transactions: null,
  graph: null,
} as {
  phase: number;
  user: TelegramBot.User | null;
  groups: Group[] | null;
  group: Group | null;
  paymentInformation: PaymentInformation | null;
  splitInformation: SplitInformation | null;
  transactions: TransactionData[] | null;
  graph: GraphData[] | null;
});
