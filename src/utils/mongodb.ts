import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}
const client = new MongoClient(uri);
let db: Db;


export const connectToDatabase = async (): Promise<{ db: Db }> => {
  try {
    await client.connect();
    db = client.db(process.env.MONGODB_DB!);
    console.log("Connected to database");
    return { db };
  } catch (error) {
    console.error(error);
    throw new Error("Could not connect to database");
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await client.close();
    console.log("Disconnected from database");
  } catch (error) {
    console.error(error);
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error("Database not connected");
  }
  return db;
};
