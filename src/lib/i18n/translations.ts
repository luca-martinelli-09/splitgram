export type SupportedLanguage = "default" | "it";
export type Dictionary = Record<SupportedLanguage, Record<string, string>>;

export const dictionary = {
  default: {
    "bot.menu_button": "Home",
    "bot.group.registered": `*🪙 Hi, I'm SplitGram, the Telegram bot that helps your group split expenses\\.*\n\n*❓ How does it work?*\n\\- Each member of the group has to press "Join"\n\\- In the private chat with the bot everyone can manage all payments and expenses for all groups\n\\- Use the \/split command in this group to see the splits\\.\n\n❓ What "¤" means.\n"¤" is the generic currency symbol`,
    "bot.group.adduser": "Join",
    "bot.error": "Oh no, an error occurred 😞",
    "bot.add_to_group": `*🪙 Hi, I'm SplitGram, the Telegram bot that helps your group split expenses\\.*\n\n*❓ How does it work?*\n\\- Add the bot to your group\n\\- Wait for all group members to join\n\\- Use the \/app command to launch the webapp and manage expenses and splits\\.\n\n❓ What "¤" means.\n"¤" is the generic currency symbol`,
    "bot.added_split": "💰 {{from}} added an expense of {{amount}} ¤",
    "bot.added_payment": "💸 {{from}} sent {{to}} {{amount}} ¤",
    "bot.is_pair": "is balanced",
    "bot.add_split": "Add expense",
    "bot.add_payment": "Add payment",
    "bot.list_transactions": "Home",
    "bot.private_chat": "Open bot",
    "app.login_error": "Hey, wait! You are not supposed to be here!",
    "app.error": "Oh no, an error occurred",
    "app.select_group": "Select a group to start splitting expenses",
    "app.set_description": "Indicate a description of the payment",
    "app.set_import": "How much was spent?",
    "app.select_payer": "Who paid?",
    description: "description",
    amount: "Amount",
    continue: "Continue",
    save: "Save",
    "app.error.amount_nan": "The amount entered is not a valid number",
    "app.error.amount_negative": "The amount must be greater than zero",
    "app.error.description_void": "The description cannot be blank",
    "app.error.payer_empty": "Select the payer",
    "app.error.members_empty": "Select at least one member of the group",
    "app.error.payment_members_empty": "Select 'from' and 'to'",
    "app.error.sum_error": "The sum is not equal to the amount",
    "app.error.percentages_not_full": "Total percentage is not 100",
    "app.loading_login": "Signing in",
    "app.set_split_mode": "How was the payment split?",
    "app.split_mode.equally": "Equally",
    "app.split_mode.unequally": "Unequally",
    "app.split_mode.percentages": "By percentages",
    "app.split_mode.shares": "By shares",
    "app.among": "Among",
    shares: "shares",
    total: "Total",
    sending: "Sending",
    from: "From",
    to: "To",
    delete: "Delete",
    "app.list.transactions": "All transactions",
    "app.list.paid_by": "{{name}} paid {{amount}} ¤ on {{date}}",
    "app.list.payment_paid": "{{nameFrom}} gave {{nameTo}} {{amount}} ¤ on {{date}}",
    "app.sure": "Are you sure?",
    "app.must_receive": "You must receive a total of",
    "app.must_give": "You need to give a total of",
    "app.is_pair": "You are balanced!",
  },
  it: {
    "bot.menu_button": "Home",
    "bot.group.registered": `*🪙 Ciao, sono SplitGram, il bot Telegram che aiuta il tuo gruppo a dividere le spese\\.*\n\n*❓ Come funziona?*\n\\- Ogni membro del gruppo deve premere su "Partecipa"\n\\- Nella chat privata con il bot ognuno potrà gestire tutti i pagamenti e le spese per tutti i gruppi\n\\- Usa il comando \/split in questo gruppo per vedere le divisioni\\.\n\n❓ Cosa significa "¤"\n"¤" è il simbolo generico di valuta\n\nPartecipanti:\n{{members}}`,
    "bot.group.adduser": "Partecipa",
    "bot.error": "Oh no, si è verificato un errore 😞",
    "bot.add_to_group": `*🪙 Ciao, sono SplitGram, il bot Telegram che aiuta il tuo gruppo a dividere le spese\\.*\n\n*❓ Come funziona?*\n\\- Aggiungi il bot al tuo gruppo\n\\- Aspetta che tutti i membri del gruppo si uniscano\n\\- Usa il comando \/app per lanciare la webapp e gestire spese e divisioni\\.\n\n❓ Cosa significa "¤"\n"¤" è il simbolo generico di valuta`,
    "bot.added_split": "💰 {{from}} ha aggiunto una spesa di {{amount}} ¤",
    "bot.added_payment": "💸 {{from}} ha inviato a {{to}} {{amount}} ¤",
    "bot.is_pair": "è in pari",
    "bot.add_split": "Aggiungi spesa",
    "bot.add_payment": "Aggiungi pagamento",
    "bot.list_transactions": "Home",
    "bot.private_chat": "Vai al bot",
    "app.login_error": "Ehi, aspetta! Tu non dovresti essere qui!",
    "app.error": "Oh no, si è verificato un errore",
    "app.select_group": "Seleziona un gruppo per iniziare a dividere le spese",
    "app.set_description": "Indica una descrizione del pagamento",
    "app.set_import": "Quanto è stato speso?",
    "app.select_payer": "Chi ha pagato?",
    description: "Descrizione",
    amount: "Importo",
    continue: "Continua",
    save: "Salva",
    "app.error.amount_nan": "L'importo inserito non è un numero valido",
    "app.error.amount_negative": "L'importo deve essere maggiore di zero",
    "app.error.description_void": "La descrizione non può essere vuota",
    "app.error.payer_empty": "Seleziona il pagante",
    "app.error.members_empty": "Seleziona almeno un membro del gruppo",
    "app.error.payment_members_empty": "Seleziona 'da' e 'a'",
    "app.error.sum_not_match": "La somma non è uguale all'importo",
    "app.error.percentages_not_full": "Il totale percentuale non è 100",
    "app.loading_login": "Accesso in corso",
    "app.set_split_mode": "Come è stato diviso il pagamento?",
    "app.split_mode.equally": "In parti uguali",
    "app.split_mode.unequally": "In parti disuguali",
    "app.split_mode.percentages": "Per percentuale",
    "app.split_mode.shares": "Per quote",
    "app.among": "Tra",
    shares: "quote",
    total: "Totale",
    sending: "Invio",
    from: "Da",
    to: "A",
    delete: "Elimina",
    "app.list.transactions": "Tutte le transazioni",
    "app.list.paid_by": "{{name}} ha pagato {{amount}} ¤ il {{date}}",
    "app.list.payment_paid": "{{nameFrom}} ha dato a {{nameTo}} {{amount}} ¤ il {{date}}",
    "app.sure": "Sei sicuro?",
    "app.must_receive": "Devi ricevere un totale di",
    "app.must_give": "Devi dare un totale di",
    "app.is_pair": "Sei in pari!",
  },
} as Dictionary;
