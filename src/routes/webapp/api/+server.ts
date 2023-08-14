import { json } from "@sveltejs/kit";
import crypto from "crypto";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";
import { getGroups } from "$lib/db/interface";
import type TelegramBot from "node-telegram-bot-api";

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

function verifyTelegram(data: string) {
  const { arr, hash, user, authDate } = getUserData(data);

  arr.sort((a, b) => a.localeCompare(b));
  const dataCheckString = arr.join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(env.BOT_TOKEN).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const validTime = new Date().getTime() / 1000 - 60 * 60;

  if (authDate >= validTime && computedHash === hash) return { valid: true, user: user };

  return { valid: false };
}

export const POST: RequestHandler = async ({ request }) => {
  const { valid, user } = verifyTelegram((await request.json()).data);

  let groups;
  try {
    groups = await getGroups(user as TelegramBot.User);
  } catch (error) {
    return new Response("", { status: 500 });
  }

  if (valid) return json({ user, groups });
  return new Response("", { status: 418 });
};
