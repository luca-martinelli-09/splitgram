import type TelegramBot from "node-telegram-bot-api";
import db from "./db";

export const registerGroup = async (chat: TelegramBot.Chat) => {
  await db.collection("groups").createIndex("id", { unique: true });

  await db.collection("groups").updateOne({ id: chat.id }, { $set: chat }, { upsert: true });
};

export const registerUserInGroup = async (user: TelegramBot.User, chat: TelegramBot.Chat) => {
  await db.collection("users").createIndex("id", { unique: true });

  const opUser = await db.collection("users").updateOne({ id: user.id }, { $set: user }, { upsert: true });
  await db.collection("groups").updateOne(
    { id: chat.id },
    {
      $addToSet: {
        members: user.id,
      },
    }
  );

  return opUser;
};

export const groupMembers = async (chat: TelegramBot.Chat) => {
  const group = (
    await db
      .collection("groups")
      .aggregate([
        { $match: { id: chat.id } },
        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "id",
            as: "members",
          },
        },
        { $limit: 1 },
      ])
      .toArray()
  ).pop();

  return group?.members as TelegramBot.User[];
};

export const getGroups = async (user: TelegramBot.User) => {
  return await db
    .collection("groups")
    .aggregate([
      { $match: { members: user.id } },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "id",
          as: "members",
        },
      },
    ])
    .toArray();
};
