import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { verifyTelegram } from "$lib/bot/utils";

export const GET: RequestHandler = async ({ url }) => {
  const { valid, user } = verifyTelegram(url.searchParams.get("login"));

  if (valid) return json({ user });
  return new Response("", { status: 418 });
};
