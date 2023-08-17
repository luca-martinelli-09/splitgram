import { get } from "svelte/store";
import { stateStore, webAppStore } from "./store";

export const updateBackButton = () => {
  get(webAppStore)?.expand();

  if (get(stateStore).phase <= 0) get(webAppStore)?.BackButton.hide();
  else get(webAppStore)?.BackButton.show();

  resetMainButton();
};

export const resetMainButton = () => {
  get(webAppStore)?.MainButton.offClick();
  get(webAppStore)?.MainButton.hide();
};

export const resetBackButton = () => {
  get(webAppStore)?.BackButton.offClick();
  get(webAppStore)?.BackButton.hide();
};

export const getNumber = (value: string | null | undefined | number, withNaN = false) => {
  if (!value) return withNaN ? NaN : 0;

  const number = parseFloat(value.toString().trim().replaceAll(",", "."));

  if (isNaN(number) && !withNaN) return 0;

  return number;
};

export const fadeOptions = { duration: 200 };

export const formatDate = (date: Date | string) => {
  date = new Date(date);

  return `${date.getDay().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
};
