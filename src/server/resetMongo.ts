import 'dotenv/config';
import { connectMongo, closeMongo } from './mongoClient.js';

const collections = ['users', 'passwords', 'predictions', 'aiChats', 'notifications', 'settings'];

async function resetMongo() {
  const database = await connectMongo();
  for (const name of collections) {
    const result = await database.collection(name).deleteMany({});
    console.log(`Cleared ${name}: ${result.deletedCount} documents`);
  }
  await closeMongo();
  console.log('MongoDB application data reset complete.');
}

resetMongo().catch((error) => {
  console.error('MongoDB reset failed:', error);
  process.exitCode = 1;
});