import { MongoClient } from "mongodb";

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const client = new MongoClient(uri);

export async function connectToDatabase() {
    await client.connect();
    const db = client.db("link-saver");
    // console.log("Database Connected!");

    return { db, client };
}
