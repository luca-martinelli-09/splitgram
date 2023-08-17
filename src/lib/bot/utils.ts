import type TelegramBot from "node-telegram-bot-api";
import * as crypto from "crypto";
import { env } from "$env/dynamic/private";

export const pmd2 = (text: string | undefined) => {
  if (!text) return "";

  const specialChars = ["_", "*", "[", "]", "(", ")", "~", "`", ">", "#", "+", "-", "=", "|", "{", "}", ".", "!"];

  specialChars.forEach((char) => {
    text = text?.replaceAll(char, "\\" + char);
  });

  return text;
};

export const formatUser = (user: TelegramBot.User) => {
  return `[${pmd2(user.first_name)} ${pmd2(user.last_name)}](tg://user?id=${user.id})`;
};

export const memberToList = (user: TelegramBot.User) => {
  return `↳ ${formatUser(user)}`;
};

function getUserData(data: string) {
  const encoded = decodeURIComponent(data);

  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];

  const userIndex = arr.findIndex((str) => str.startsWith("user="));
  const user = arr[userIndex] ? JSON.parse(arr[userIndex].split("=")[1]) : null;

  const authDateIndex = arr.findIndex((str) => str.startsWith("auth_date="));
  const authDate = parseInt(arr[authDateIndex]?.split("=")[1]);

  return {
    arr,
    hash,
    user,
    authDate,
  };
}

export const verifyTelegram = (data: string | null | undefined) => {
  if (!data) return { valid: false };

  const { arr, hash, user, authDate } = getUserData(data);

  arr.sort((a, b) => a.localeCompare(b));
  const dataCheckString = arr.join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(env.BOT_TOKEN).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const validTime = new Date().getTime() / 1000 - 60 * 60;

  if (authDate >= validTime && computedHash === hash) return { valid: true, user: user };

  return { valid: false };
};
