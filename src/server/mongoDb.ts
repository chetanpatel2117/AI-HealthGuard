import fs from 'fs';
import path from 'path';
import { Db } from 'mongodb';
import { ChatMessage, NotificationItem, PredictionResult, User } from '../types/index.js';
import { connectMongo } from './mongoClient.js';

interface JsonDatabaseSchema {
  users: User[];
  passwords: Record<string, string>;
  predictions: PredictionResult[];
  aiChats: Record<string, ChatMessage[]>;
  notifications: Record<string, NotificationItem[]>;
  settings: Record<string, any>;
}

class MongoDatabase {
  private database: Db | null = null;
  private initialized: Promise<void> | null = null;

  private async getDatabase(): Promise<Db> {
    if (!this.database) this.database = await connectMongo();
    return this.database;
  }

  async initialize(): Promise<void> {
    if (!this.initialized) {
      this.initialized = this.bootstrapFromJson();
    }
    await this.initialized;
  }

  private async bootstrapFromJson(): Promise<void> {
    const database = await this.getDatabase();
    const users = database.collection<User>('users');
    if (await users.estimatedDocumentCount() > 0) return;

    const file = path.join(process.cwd(), 'data', 'healthguard.json');
    if (!fs.existsSync(file)) return;
    const schema = JSON.parse(fs.readFileSync(file, 'utf-8')) as JsonDatabaseSchema;

    if (schema.users?.length) await users.insertMany(schema.users);
    const passwordEntries = Object.entries(schema.passwords || {}).map(([userId, hash]) => ({ userId, hash }));
    if (passwordEntries.length) await database.collection('passwords').insertMany(passwordEntries);
    if (schema.predictions?.length) await database.collection<PredictionResult>('predictions').insertMany(schema.predictions);

    const chats = Object.entries(schema.aiChats || {}).flatMap(([userId, messages]) => messages.map((message) => ({ userId, ...message })));
    if (chats.length) await database.collection('aiChats').insertMany(chats);
    const notifications = Object.entries(schema.notifications || {}).flatMap(([userId, items]) => items.map((item) => ({ userId, ...item })));
    if (notifications.length) await database.collection('notifications').insertMany(notifications);
    const settings = Object.entries(schema.settings || {}).map(([userId, value]) => ({ userId, value }));
    if (settings.length) await database.collection('settings').insertMany(settings);
    console.log('MongoDB initialized from data/healthguard.json');
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.initialize();
    return (await (await this.getDatabase()).collection<User>('users').findOne({ email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } })) || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    await this.initialize();
    return (await (await this.getDatabase()).collection<User>('users').findOne({ id })) || undefined;
  }

  async createUser(user: User, passwordHash: string): Promise<User> {
    await this.initialize();
    const database = await this.getDatabase();
    await database.collection<User>('users').insertOne(user);
    await database.collection('passwords').insertOne({ userId: user.id, hash: passwordHash });
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    await this.initialize();
    const database = await this.getDatabase();
    const result = await database.collection<User>('users').findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' });
    return result || undefined;
  }

  async getPasswordHash(userId: string): Promise<string | undefined> {
    await this.initialize();
    const record = await (await this.getDatabase()).collection<{ userId: string; hash: string }>('passwords').findOne({ userId });
    return record?.hash;
  }

  async savePrediction(prediction: PredictionResult): Promise<PredictionResult> {
    await this.initialize();
    await (await this.getDatabase()).collection<PredictionResult>('predictions').insertOne(prediction);
    return prediction;
  }

  async getPredictionsByUserId(userId: string): Promise<PredictionResult[]> {
    await this.initialize();
    return (await (await this.getDatabase()).collection<PredictionResult>('predictions').find({ $or: [{ userId }, { userId: 'usr_demo_101' }] }).sort({ timestamp: -1 }).toArray());
  }

  async deletePrediction(id: string): Promise<boolean> {
    await this.initialize();
    const result = await (await this.getDatabase()).collection<PredictionResult>('predictions').deleteOne({ id });
    return result.deletedCount > 0;
  }

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    await this.initialize();
    const messages = await (await this.getDatabase()).collection<ChatMessage & { userId: string }>('aiChats').find({ $or: [{ userId }, { userId: 'usr_demo_101' }] }, { projection: { _id: 0, userId: 0 } }).sort({ timestamp: 1 }).toArray();
    return messages;
  }

  async saveChatMessage(userId: string, message: ChatMessage): Promise<ChatMessage> {
    await this.initialize();
    await (await this.getDatabase()).collection('aiChats').insertOne({ userId, ...message });
    return message;
  }

  async getNotifications(userId: string): Promise<NotificationItem[]> {
    await this.initialize();
    return await (await this.getDatabase()).collection<NotificationItem & { userId: string }>('notifications').find({ $or: [{ userId }, { userId: 'usr_demo_101' }] }, { projection: { _id: 0, userId: 0 } }).sort({ timestamp: -1 }).toArray();
  }

  async markNotificationRead(userId: string, notifId: string): Promise<void> {
    await this.initialize();
    await (await this.getDatabase()).collection('notifications').updateOne({ userId, id: notifId }, { $set: { read: true } });
  }

  async clearUserData(userId: string): Promise<boolean> {
    await this.initialize();
    const database = await this.getDatabase();
    const results = await Promise.all([
      database.collection('users').deleteOne({ id: userId }),
      database.collection('passwords').deleteMany({ userId }),
      database.collection('predictions').deleteMany({ userId }),
      database.collection('aiChats').deleteMany({ userId }),
      database.collection('notifications').deleteMany({ userId }),
      database.collection('settings').deleteMany({ userId }),
    ]);
    return results.some((result) => result.deletedCount > 0);
  }
}

export const db = new MongoDatabase();