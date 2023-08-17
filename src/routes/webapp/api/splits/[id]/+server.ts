import type { RequestHandler } from "./$types";
import { editSplit, deleteSplit } from "$lib/db/interface";
import { verifyTelegram } from "$lib/bot/utils";

export const POST: RequestHandler = async ({ url, params, request }) => {
  const { valid } = verifyTelegram(url.searchParams.get("login"));
  if (!valid) return new Response("", { status: 418 });

  const data = (await request.json()) as TransactionData;

  try {
    if (url.searchParams.get("delete") === "true") await deleteSplit(params.id);
    else await editSplit(params.id, data);
  } catch (error) {
    console.log(error);
    return new Response("", { status: 500 });
  }

  return new Response("", { status: 200 });
};
