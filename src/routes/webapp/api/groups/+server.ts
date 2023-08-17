import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getGroups } from "$lib/db/interface";
import type TelegramBot from "node-telegram-bot-api";
import { verifyTelegram } from "$lib/bot/utils";

export const GET: RequestHandler = async ({ url }) => {
  const { valid, user } = verifyTelegram(url.searchParams.get("login"));
  if (!valid) return new Response("", { status: 418 });

  try {
    user.groups = await getGroups(user as TelegramBot.User);
  } catch (error) {
    console.log(error);
    return new Response("", { status: 500 });
  }

  return Response.json({ ...user });
};
