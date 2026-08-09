/**
 * Migration script: import data/healthguard.json into MongoDB collections
 * Usage:
 *   Set MONGODB_URI (optional) and run: npx tsx src/server/migrateToMongo.ts
 */

import fs from 'fs';
import path from 'path';
import { connectMongo, closeMongo } from './mongoClient';

async function migrate() {
  const dataFile = path.join(process.cwd(), 'data', 'healthguard.json');
  if (!fs.existsSync(dataFile)) {
    console.error('No data/healthguard.json found to migrate.');
    process.exit(1);
  }

  const raw = fs.readFileSync(dataFile, 'utf-8');
  const doc = JSON.parse(raw);

  const db = await connectMongo();
  console.log('Connected to MongoDB, migrating collections...');

  // Collections: users, passwords, predictions, aiChats, notifications, settings
  if (Array.isArray(doc.users) && doc.users.length > 0) {
    const col = db.collection('users');
    await col.deleteMany({});
    await col.insertMany(doc.users);
    console.log(`Migrated ${doc.users.length} users`);
  }

  if (doc.passwords && Object.keys(doc.passwords).length > 0) {
    const col = db.collection('passwords');
    const bulk = Object.entries(doc.passwords).map(([userId, hash]) => ({ userId, hash }));
    await col.deleteMany({});
    if (bulk.length) await col.insertMany(bulk as any);
    console.log(`Migrated ${bulk.length} password entries`);
  }

  if (Array.isArray(doc.predictions) && doc.predictions.length > 0) {
    const col = db.collection('predictions');
    await col.deleteMany({});
    await col.insertMany(doc.predictions);
    console.log(`Migrated ${doc.predictions.length} predictions`);
  }

  if (doc.aiChats && Object.keys(doc.aiChats).length > 0) {
    const col = db.collection('aiChats');
    await col.deleteMany({});
    const docs: any[] = [];
    for (const [userId, messages] of Object.entries(doc.aiChats)) {
      (messages as any[]).forEach((m) => docs.push({ userId, ...m }));
    }
    if (docs.length) await col.insertMany(docs);
    console.log(`Migrated ${docs.length} chat messages`);
  }

  if (doc.notifications && Object.keys(doc.notifications).length > 0) {
    const col = db.collection('notifications');
    await col.deleteMany({});
    const docs: any[] = [];
    for (const [userId, notifs] of Object.entries(doc.notifications)) {
      (notifs as any[]).forEach((n) => docs.push({ userId, ...n }));
    }
    if (docs.length) await col.insertMany(docs);
    console.log(`Migrated ${docs.length} notifications`);
  }

  if (doc.settings && Object.keys(doc.settings).length > 0) {
    const col = db.collection('settings');
    await col.deleteMany({});
    const docs: any[] = [];
    for (const [userId, settings] of Object.entries(doc.settings)) {
      docs.push({ userId, settings });
    }
    if (docs.length) await col.insertMany(docs);
    console.log(`Migrated ${docs.length} settings entries`);
  }

  await closeMongo();
  console.log('Migration complete.');
}

migrate().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
