<p align="center">
  <img src="./static/favicon.png" width="150" title="SplitGram">
</p>
<h1 align="center">SplitGram</h1>

[@SplitGram_bot](https://t.me/SplitGram_bot) on Telegram

## ❓ How does it work?

- Add the bot to your group;
- Wait for all group members to join;
- Use the /app command to launch the webapp and manage expenses and splits.

## ❓ What "¤" means?

"¤" is the generic currency symbol.

## Run on custom server

First, you need to create a `.env` file compiling the `.env.example` file.

You need to create a Telegram Bot and retrieving the BOT APY KEY

You need to create a MongoDB database with the following collections:

- users
- groups
- splits
- payments

Then, you can simply run the Dockerized version with the command:

```bash
docker compose up -d
```

## Contribution

Any contribution is well accepted, as reporting any issue you found!

## Donating

If you want to support me, you can do it via PayPal at [@MartinelliLuca](https://paypal.me/MartinelliLuca). **Thank you!**
