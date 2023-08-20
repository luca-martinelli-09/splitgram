import type { RequestHandler } from "./$types";
import { getGroupById, getPayments, getSplits, simplifyTransactions } from "$lib/db/interface";
import { verifyTelegram } from "$lib/bot/utils";

export const GET: RequestHandler = async ({ url, params }) => {
  const { valid } = verifyTelegram(url.searchParams.get("login"));
  if (!valid) return new Response("", { status: 418 });

  let group;
  let splits;
  let payments;
  let graph;

  try {
    group = await getGroupById(parseInt(params.id));

    splits = await getSplits(group);
    payments = await getPayments(group);

    graph = await simplifyTransactions(group, splits, payments);
  } catch (error) {
    console.log(error);
    return new Response("", { status: 500 });
  }

  const transactions = [...splits, ...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return Response.json({ ...group, transactions, graph });
};
