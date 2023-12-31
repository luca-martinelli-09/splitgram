import type TelegramBot from "node-telegram-bot-api";
import db from "./db";
import { ObjectId } from "mongodb";

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

export const getGroupById = async (groupId: number) => {
  const group = (
    await db
      .collection("groups")
      .aggregate([
        { $match: { id: groupId } },
        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "id",
            as: "members",
          },
        },
        { $unwind: "$members" },
        {
          $sort: {
            "members.first_name": 1,
          },
        },
        {
          $group: {
            _id: "$_id",
            member: { $first: "$$ROOT" },
            members: {
              $push: "$members",
            },
          },
        },
        {
          $replaceRoot: { newRoot: { $mergeObjects: ["$member", { members: "$members" }] } },
        },
        { $limit: 1 },
      ])
      .toArray()
  ).pop();

  return group as Group;
};

export const groupMembers = async (group: TelegramBot.Chat) => {
  const groupInfo = await getGroupById(group.id);

  return groupInfo?.members as TelegramBot.User[];
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
      { $unwind: "$members" },
      {
        $sort: {
          "members.first_name": 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          member: { $first: "$$ROOT" },
          members: {
            $push: "$members",
          },
        },
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: ["$member", { members: "$members" }] } },
      },
    ])
    .toArray();
};

export const addSplit = async (data: TransactionData) => {
  await db.collection("splits").createIndex("group");
  await db.collection("splits").createIndex("from");
  await db.collection("splits").createIndex("date");

  return await db.collection("splits").insertOne({
    group: data.group.id,
    date: new Date(),
    from: data.from.id,
    description: data.description,
    amount: data.amount,
    mode: data.mode,
    splits: data.splits?.filter((s) => s.selected).map((s) => ({ user: s.id, amount: data.mode === "equally" ? null : s.amount })),
  });
};

export const editSplit = async (id: string, data: TransactionData) => {
  return await db.collection("splits").updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        group: data.group.id,
        from: data.from.id,
        description: data.description,
        amount: data.amount,
        mode: data.mode,
        splits: data.splits?.filter((s) => s.selected).map((s) => ({ user: s.id, amount: data.mode === "equally" ? null : s.amount })),
      },
    }
  );
};

export const deleteSplit = async (id: string) => {
  return await db.collection("splits").deleteOne({
    _id: new ObjectId(id),
  });
};

export const addPayment = async (data: TransactionData) => {
  await db.collection("payments").createIndex("group");
  await db.collection("payments").createIndex("from");
  await db.collection("payments").createIndex("date");
  await db.collection("payments").createIndex("to");

  return await db.collection("payments").insertOne({
    group: data.group.id,
    date: new Date(),
    from: data.from.id,
    to: data.to?.id,
    amount: data.amount,
  });
};

export const editPayment = async (id: string, data: TransactionData) => {
  return await db.collection("payments").updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        group: data.group.id,
        from: data.from.id,
        to: data.to?.id,
        amount: data.amount,
      },
    }
  );
};

export const deletePayment = async (id: string) => {
  return await db.collection("payments").deleteOne({
    _id: new ObjectId(id),
  });
};

export const getSplits = async (group: Group) => {
  if (!group) return [];

  const splits = await db
    .collection("splits")
    .aggregate([
      { $match: { group: group.id } },
      {
        $lookup: {
          from: "users",
          localField: "from",
          foreignField: "id",
          as: "from",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "splits.user",
          foreignField: "id",
          as: "splitUsers",
        },
      },
      {
        $project: {
          date: 1,
          description: 1,
          amount: 1,
          mode: 1,
          from: 1,
          splits: {
            $map: {
              input: "$splits",
              as: "amounts",
              in: {
                $mergeObjects: [
                  "$$amounts",
                  { selected: true },
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$splitUsers",
                          as: "users",
                          cond: {
                            $eq: ["$$users.id", "$$amounts.user"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      { $unwind: "$from" },
      { $sort: { date: -1 } },
    ])
    .toArray();

  return splits as TransactionData[];
};

export const getPayments = async (group: Group) => {
  if (!group) return [];

  const payments = await db
    .collection("payments")
    .aggregate([
      { $match: { group: group.id } },
      {
        $lookup: {
          from: "users",
          localField: "from",
          foreignField: "id",
          as: "from",
        },
      },
      { $unwind: "$from" },
      {
        $lookup: {
          from: "users",
          localField: "to",
          foreignField: "id",
          as: "to",
        },
      },
      { $unwind: "$to" },
      { $sort: { date: -1 } },
    ])
    .toArray();

  return payments as TransactionData[];
};

function getMaxAndMin(amount: Record<string, number>) {
  let maxIndex: string | null = null;
  let minIndex: string | null = null;

  Object.entries(amount).forEach(([index, value]) => {
    if (maxIndex === null) maxIndex = index;
    if (minIndex === null) minIndex = index;

    if (value >= amount[maxIndex]) maxIndex = index;
    if (value <= amount[minIndex]) minIndex = index;
  });

  return [maxIndex, minIndex];
}

function calculateMinCashGraph(amount: Record<string, number>, transactions = {} as Record<string, Record<string, number>>) {
  const [mxCredit, mxDebit] = getMaxAndMin(amount);

  if (!mxCredit || !mxDebit) return transactions;
  

  if (floorAmount(amount[mxCredit]) === 0 || floorAmount(amount[mxDebit]) === 0) return transactions;

  const min = floorAmount(Math.min(-amount[mxDebit], amount[mxCredit]));

  amount[mxCredit] -= min;
  amount[mxDebit] += min;

  if (!transactions[mxDebit]) transactions[mxDebit] = {};
  if (!transactions[mxCredit]) transactions[mxCredit] = {};
  transactions[mxDebit][mxCredit] = min;
  transactions[mxCredit][mxDebit] = -min;

  return calculateMinCashGraph(amount, transactions);
}

function minCashGraph(graph: Record<string, Record<string, number>>) {
  const amount = {} as Record<string, number>;

  console.log(graph)

  Object.keys(graph).forEach((fromId) => {
    amount[fromId] = amount[fromId] || 0;
    Object.keys(graph).forEach((toId) => {
      amount[fromId] += (graph[toId][fromId] || 0) - (graph[fromId][toId] || 0);
    });
  });

  console.log(amount)

  return calculateMinCashGraph(amount);
}

function floorAmount(amount: number) {
  return Math.round(amount * 100) / 100;
}

export const simplifyTransactions = async (group: Group, splits: TransactionData[] | null = null, payments: TransactionData[] | null = null) => {
  splits = splits || ((await getSplits(group)) as TransactionData[]);
  payments = payments || ((await getPayments(group)) as TransactionData[]);

  const groupMembers = group.members
    .sort((a, b) => a.first_name.localeCompare(b.first_name))
    .reduce((g, m) => {
      g[m.id] = m;

      return g;
    }, {} as Record<string, TelegramBot.User>);

  const usersGraph = {} as Record<string, Record<string, number>>;
  Object.keys(groupMembers).forEach((fromId) => {
    usersGraph[fromId] = {};
    Object.keys(groupMembers).forEach((toId) => {
      if (fromId !== toId) usersGraph[fromId][toId] = 0;
    });
  });

  const allTransactions = [] as TransactionGraph[];

  console.log(splits)

  splits.forEach((split) => {
    const sumShares = split.mode === "shares" ? split.splits?.reduce((t, u) => (t += u.selected ? u.amount || 0 : 0), 0) || 0 : 0;
    const totalSplits = split.splits?.length || 0;

    split.splits?.forEach((member) => {
      const trans = { to: split.from, from: { ...member, selected: undefined, amount: undefined, user: undefined }, amount: 0 };

      if (split.mode === "equally") trans.amount = split.amount / totalSplits;
      else if (split.mode === "unequally") trans.amount = member.amount || 0;
      else if (split.mode === "percentages") trans.amount = (split.amount * (member.amount || 0)) / 100;
      else if (split.mode === "shares") trans.amount = (split.amount * (member.amount || 0)) / sumShares;

      if (trans.from.id !== trans.to.id && trans.amount && trans.amount > 0) allTransactions.push(trans);
    });
  });

  payments.forEach((payment) => {
    if (payment.to && payment.from.id !== payment.to?.id && payment.amount && payment.amount > 0) allTransactions.push({ to: payment.from, from: payment.to, amount: payment.amount });
  });

  allTransactions.forEach((transaction) => {
    usersGraph[transaction.from.id][transaction.to.id] += transaction.amount;
  });

  console.log(allTransactions);

  const simplifiedGraph = minCashGraph(usersGraph);

  console.log(simplifiedGraph);

  const finalGraph = [] as GraphData[];

  group.members.forEach((member) => {
    const graph = { ...member, debts: [] } as GraphData;

    Object.entries(simplifiedGraph[member.id] || {}).forEach(([toId, amount]) => {
      graph.debts.push({ ...groupMembers[toId], amount });
    });

    if (graph.debts.length > 0) finalGraph.push(graph);
  });

  return finalGraph.sort((a, b) => a.first_name.localeCompare(b.first_name));
};
