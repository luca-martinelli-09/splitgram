import { env } from "$env/dynamic/private";
import TelegramBot from "node-telegram-bot-api";
import { translate } from "../i18n/i18n";
import { getGroupById, groupMembers, registerGroup, registerUserInGroup, simplifyTransactions } from "../db/interface";
import { formatUser, memberToList, pmd2 } from "./utils";

const BOT_TOKEN = env.BOT_TOKEN;
const BASE_HOST = env.APP_HOST;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is not set");
if (!BASE_HOST) throw new Error("BASE_HOST is not set");

export const bot = new TelegramBot(BOT_TOKEN);

export const setWebhook = async () => {
  return await bot.setWebHook(`${BASE_HOST}/bot`);
};

function sendPrivateMessage(chatId: number, languageCode: string | undefined) {
  bot.sendMessage(chatId, translate(languageCode, "bot.add_to_group"), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      inline_keyboard: [
        [{ text: translate(languageCode, "bot.list_transactions"), web_app: { url: BASE_HOST + "/webapp/list" } }],
        [{ text: translate(languageCode, "bot.add_split"), web_app: { url: BASE_HOST + "/webapp/add-split" } }],
        [{ text: translate(languageCode, "bot.add_payment"), web_app: { url: BASE_HOST + "/webapp/add-payment" } }],
      ],
    },
  });
}

const sendError = (chatId: TelegramBot.ChatId, languageCode: string | undefined, error: any) => {
  console.log(error);
  bot.sendMessage(chatId, translate(languageCode, "bot.error"));
};

const ADD_USER_KEYBOARD = (languageCode: string | undefined) =>
  ({
    inline_keyboard: [
      [
        {
          text: translate(languageCode, "bot.group.adduser"),
          callback_data: "adduser",
        },
      ],
    ],
  } as TelegramBot.InlineKeyboardMarkup);

export const OPEN_PRIVATE_KEYBOARD = (languageCode: string | undefined) =>
  ({
    inline_keyboard: [
      [
        {
          text: translate(languageCode, "bot.private_chat"),
          callback_data: "openbot",
        },
        {
          text: translate(languageCode, "bot.split"),
          callback_data: "split",
        },
      ],
    ],
  } as TelegramBot.InlineKeyboardMarkup);

bot.onText(/\/start|\/setup|\/app/, async (message) => {
  const languageCode = message.from?.language_code;

  if (message.chat.type === "channel") return;

  if (message.chat.type === "private") {
    sendPrivateMessage(message.chat.id, languageCode);

    return;
  }

  try {
    await registerGroup(message.chat);
    const members = (await groupMembers(message.chat)) || [];

    return bot.sendMessage(
      message.chat.id,
      translate(languageCode, "bot.group.registered", {
        members: members.map((m: TelegramBot.User) => memberToList(m)).join("\n"),
      }),
      {
        parse_mode: "MarkdownV2",
        reply_markup: ADD_USER_KEYBOARD(languageCode),
      }
    );
  } catch (error) {
    sendError(message.chat.id, languageCode, error);
  }
});

bot.on("callback_query", (query) => {
  if (!query.message) return;

  if (query.data === "adduser") registerUser(query.from, query.message);
  else if (query.data === "openbot") sendPrivateMessage(query.from.id, query.from.language_code);
  else if (query.data === "split") sendSplitExpenses(query.message);
});

async function registerUser(user: TelegramBot.User, message: TelegramBot.Message) {
  const languageCode = user.language_code;

  try {
    await registerUserInGroup(user, message.chat);
    const members = (await groupMembers(message.chat)) || [];

    bot.editMessageText(
      translate(languageCode, "bot.group.registered", {
        members: members.map((m: TelegramBot.User) => memberToList(m)).join("\n"),
      }),
      {
        chat_id: message?.chat.id,
        message_id: message?.message_id,
        parse_mode: "MarkdownV2",
        reply_markup: ADD_USER_KEYBOARD(languageCode),
      }
    );
  } catch (error) {
    sendError(message.chat.id, languageCode, error);
  }
}

async function sendSplitExpenses(message: TelegramBot.Message) {
  const languageCode = message.from?.language_code;

  try {
    const group = await getGroupById(message.chat.id);
    const graph = (await simplifyTransactions(group)) || [];

    let sendMessage = "";

    if (graph.length <= 0) sendMessage = translate(languageCode, "bot.group.is_pair");

    graph.forEach((g) => {
      sendMessage += `\n🧙‍♂️ ${formatUser(g)}\n`;

      g.debts.forEach((d) => {
        if (d.amount === 0) return (sendMessage += "  ↳ " + translate(languageCode, "bot.is_pair") + "\n");

        sendMessage += `  ↳ ` + pmd2(Math.abs(d.amount).toFixed(2)) + ` ¤`;
        sendMessage += d.amount > 0 ? " ⏩ " : " ⏪ ";
        sendMessage += `${formatUser(d)}\n`;
      });
    });

    return bot.sendMessage(message.chat.id, sendMessage, {
      parse_mode: "MarkdownV2",
      reply_markup: OPEN_PRIVATE_KEYBOARD(languageCode),
    });
  } catch (error) {
    sendError(message.chat.id, languageCode, error);
  }
}

bot.onText(/\/split/, async (message) => {
  sendSplitExpenses(message);
});
