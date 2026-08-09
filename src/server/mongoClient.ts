import 'dotenv/config';
import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB || 'healthguard';

let client: MongoClient | null = null;
let databasePromise: Promise<Db> | null = null;

export async function connectMongo(): Promise<Db> {
  if (!databasePromise) {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    databasePromise = client.connect().then(() => client!.db(DB_NAME));
  }
  return databasePromise;
}

export async function closeMongo(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    databasePromise = null;
  }
}
