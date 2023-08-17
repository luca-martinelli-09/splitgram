import type { RequestHandler } from "./$types";
import { editPayment, deletePayment } from "$lib/db/interface";
import { verifyTelegram } from "$lib/bot/utils";

export const POST: RequestHandler = async ({ url, params, request }) => {
  const { valid } = verifyTelegram(url.searchParams.get("login"));
  if (!valid) return new Response("", { status: 418 });

  const data = (await request.json()) as TransactionData;

  try {
    if (url.searchParams.get("delete") === "true") await deletePayment(params.id);
    else await editPayment(params.id, data);
  } catch (error) {
    console.log(error);
    return new Response("", { status: 500 });
  }

  return new Response("", { status: 200 });
};
