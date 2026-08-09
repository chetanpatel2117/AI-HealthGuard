/**
 * AI HealthGuard - MongoDB Database Layer
 * Uses MongoDB collections for users, predictions, chats, and notifications.
 */

import { MongoClient, Db, Collection } from 'mongodb';
import { User, PredictionResult, ChatMessage, NotificationItem } from '../types/index.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const MONGO_DB = process.env.MONGO_DB || 'ai-healthguard';

interface UserDoc extends User {
  passwordHash?: string;
}

interface ChatDocument {
  userId: string;
  messages: ChatMessage[];
}

interface NotificationDocument {
  userId: string;
  items: NotificationItem[];
}

class Database {
  private client: MongoClient;
  private db?: Db;
  private users?: Collection<UserDoc>;
  private predictions?: Collection<PredictionResult>;
  private chats?: Collection<ChatDocument>;
  private notifications?: Collection<NotificationDocument>;
  private initPromise: Promise<void>;

  constructor() {
    this.client = new MongoClient(MONGO_URI);
    this.initPromise = this.init();
  }

  private async init() {
    try {
      await this.client.connect();
      this.db = this.client.db(MONGO_DB);
      this.users = this.db.collection<UserDoc>('users');
      this.predictions = this.db.collection<PredictionResult>('predictions');
      this.chats = this.db.collection<ChatDocument>('chats');
      this.notifications = this.db.collection<NotificationDocument>('notifications');

      await Promise.all([
        this.users.createIndex({ email: 1 }, { unique: true }),
        this.predictions.createIndex({ userId: 1 }),
        this.chats.createIndex({ userId: 1 }),
        this.notifications.createIndex({ userId: 1 }),
      ]);
    } catch (err) {
      console.error('MongoDB initialization failed:', err);
    }
  }

  private async ready() {
    return this.initPromise;
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ready();
    return this.users?.findOne({ email: email.toLowerCase() }, { projection: { passwordHash: 0 } }) ?? undefined;
  }

  public async getUserById(id: string): Promise<User | undefined> {
    await this.ready();
    return this.users?.findOne({ id }, { projection: { passwordHash: 0 } }) ?? undefined;
  }

  public async createUser(user: User, passwordHash: string): Promise<User> {
    await this.ready();
    await this.users?.insertOne({ ...user, passwordHash });
    return user;
  }

  public async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    await this.ready();
    const result = await this.users?.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after', projection: { passwordHash: 0 } });
    return result?.value ?? undefined;
  }

  public async getPasswordHash(userId: string): Promise<string | undefined> {
    await this.ready();
    const user = await this.users?.findOne({ id: userId }, { projection: { passwordHash: 1 } });
    return user?.passwordHash;
  }

  public async savePrediction(prediction: PredictionResult): Promise<PredictionResult> {
    await this.ready();
    await this.predictions?.insertOne(prediction);
    return prediction;
  }

  public async getPredictionsByUserId(userId: string): Promise<PredictionResult[]> {
    await this.ready();
    return (await this.predictions?.find({ userId }).sort({ timestamp: -1 }).toArray()) ?? [];
  }

  public async deletePrediction(id: string): Promise<boolean> {
    await this.ready();
    const result = await this.predictions?.deleteOne({ id });
    return result?.deletedCount === 1;
  }

  public async getChatHistory(userId: string): Promise<ChatMessage[]> {
    await this.ready();
    const doc = await this.chats?.findOne({ userId });
    return doc?.messages ?? [];
  }

  public async saveChatMessage(userId: string, message: ChatMessage): Promise<ChatMessage> {
    await this.ready();
    await this.chats?.updateOne(
      { userId },
      { $push: { messages: message } },
      { upsert: true }
    );
    return message;
  }

  public async getNotifications(userId: string): Promise<NotificationItem[]> {
    await this.ready();
    const doc = await this.notifications?.findOne({ userId });
    return doc?.items ?? [];
  }

  public async markNotificationRead(userId: string, notifId: string): Promise<void> {
    await this.ready();
    await this.notifications?.updateOne(
      { userId, 'items.id': notifId },
      { $set: { 'items.$.read': true } }
    );
  }
}
export const db = new Database();
