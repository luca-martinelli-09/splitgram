import type { RequestHandler } from "./$types";
import { addSplit } from "$lib/db/interface";
import { formatUser, pmd2, verifyTelegram } from "$lib/bot/utils";
import { OPEN_PRIVATE_KEYBOARD, bot } from "$lib/bot/bot";
import { translate } from "$lib/i18n/i18n";

export const POST: RequestHandler = async ({ url, request }) => {
  const { user, valid } = verifyTelegram(url.searchParams.get("login"));
  if (!valid) return new Response("", { status: 418 });

  const data = (await request.json()) as TransactionData;

  try {
    await addSplit(data);
  } catch (error) {
    console.log(error);
    return new Response("", { status: 500 });
  }

  bot.sendMessage(
    data.group.id,
    translate(user.language_code, "bot.added_split", {
      from: formatUser(data.from),
      amount: pmd2(data.amount.toFixed(2)),
    }),
    {
      parse_mode: "MarkdownV2",
      reply_markup: OPEN_PRIVATE_KEYBOARD(user.language_code),
    }
  );

  return new Response("", { status: 200 });
};
