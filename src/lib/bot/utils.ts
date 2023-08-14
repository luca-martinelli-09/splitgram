import type TelegramBot from "node-telegram-bot-api";

export const pmd2 = (text: string | undefined) => {
  if (!text) return "";

  const specialChars = ["_", "*", "[", "]", "(", ")", "~", "`", ">", "#", "+", "-", "=", "|", "{", "}", ".", "!"];

  specialChars.forEach((char) => {
    text = text?.replaceAll(char, "\\" + char);
  });

  return text;
};

export const memberToList = (user: TelegramBot.User) => {
  return `↳ [${pmd2(user.first_name)} ${pmd2(user.last_name)}](tg://user?id=${user.id})`;
};
