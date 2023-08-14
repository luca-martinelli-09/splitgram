import { env } from "$env/dynamic/private";
import TelegramBot from "node-telegram-bot-api";
import { translate } from "../i18n/i18n";
import { groupMembers, registerGroup, registerUserInGroup } from "../db/interface";
import { memberToList } from "./utils";

const BOT_TOKEN = env.BOT_TOKEN;
const BASE_HOST = env.APP_HOST;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is not set");
if (!BASE_HOST) throw new Error("BASE_HOST is not set");

export const bot = new TelegramBot(BOT_TOKEN);

export const setWebhook = async () => {
  return await bot.setWebHook(`${BASE_HOST}/bot`);
};

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

bot.onText(/\/start|\/setup/, async (message) => {
  const languageCode = message.from?.language_code;

  if (message.chat.type === "channel") return;

  if (message.chat.type === "private") {
    bot.sendMessage(message.chat.id, translate(languageCode, "bot.add_to_group"), {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [[{ text: "Spese", web_app: { url: BASE_HOST + "/webapp" } }]],
      },
    });

    bot.setChatMenuButton({
      chat_id: message.chat.id,
      menu_button: {
        text: translate(languageCode, "bot.menu_button"),
        type: "web_app",
        web_app: { url: BASE_HOST + "/webapp" },
      },
    });

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
