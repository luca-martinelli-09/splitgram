export type SupportedLanguage = "default" | "it";
export type Dictionary = Record<SupportedLanguage, Record<string, string>>;

export const dictionary = {
  default: {
    "bot.menu_button": "Split",
    "bot.group.registered": `*✅ SUCCESSFULLY REGISTERED GROUP*\n\nEach member must press "Join" to participate in the division of expenses\.`,
    "bot.group.adduser": "Join",
    "bot.error": "Oh no, an error occurred 😞",
    "bot.add_to_group": "💁‍♂️ To use this bot, add it to a group, use the command /start \\(in the group\\) and follow the instructions\\!",
    "app.error": "Hey, wait! You're not supposed to be here!",
    "app.select_group": "Select a group to start sharing expenses",
  },
  it: {
    "bot.menu_button": "Spese",
    "bot.group.registered": `*✅ GRUPPO REGISTRATO*\n\nÈ necessario che ogni membro prema "Partecipa" per partecipare alla divisione delle spese\\.\n\nSi sono già aggiunti:\n{{members}}`,
    "bot.group.adduser": "Partecipa",
    "bot.error": "Oh no, si è verificato un errore 😞",
    "bot.add_to_group": "💁‍♂️ Per poter utilizzare questo bot, aggiungilo a un gruppo, usa il comando /start \\(nel gruppo\\) e segui le istruzioni\\!",
    "app.error": "Ehi, aspetta! Tu non dovresti essere qui!",
    "app.select_group": "Seleziona un gruppo per iniziare a dividere le spese",
  },
} as Dictionary;
