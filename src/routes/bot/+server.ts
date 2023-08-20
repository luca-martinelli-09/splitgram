import { bot, setWebhook } from "$lib/bot/bot";
import type { RequestHandler } from "./$types.js";

export const POST: RequestHandler = async ({ request }) => {
  try {
    bot.processUpdate(await request.json());
    return new Response("", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("", { status: 500 });
  }
};

export const GET: RequestHandler = async ({ url }) => {
  const set = Number(url.searchParams.get("set") ?? "0");

  if (set <= 0) return new Response("", { status: 404 });

  return Response.json(await setWebhook());
};
