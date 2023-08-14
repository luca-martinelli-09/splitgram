import { env } from "$env/dynamic/private";
import { MongoClient } from "mongodb";

if (!env.MONGO_URI) throw Error("MONGO_URI not defined.");

const client = new MongoClient(env.MONGO_URI);
await client.connect();

export default client.db("splitgram");