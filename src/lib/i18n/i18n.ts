import { derived, writable } from "svelte/store";
import { dictionary, type SupportedLanguage } from "./translations";

export const locale = writable("default");
export const locales = Object.keys(dictionary);

export const translate = (locale: string | undefined | null, key: string, vars: Record<string, string> | null | undefined = null) => {
  if (!key) throw new Error("no key provided to $t()");
  if (!locale || !locales.includes(locale)) locale = "default";

  let text = dictionary[locale as SupportedLanguage][key];

  if (!text) throw new Error(`no translation found for ${locale}.${key}`);

  if (vars)
    Object.keys(vars).map((k) => {
      const regex = new RegExp(`{{${k}}}`, "g");
      text = text.replace(regex, vars[k]);
    });

  return text;
};

export const _ = derived(
  locale,
  ($locale: string) =>
    (key: string, vars = {}) =>
      translate($locale, key, vars)
);
