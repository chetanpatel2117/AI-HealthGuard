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
  password_hash?: string;
  user_id?: string;
  full_name?: string;
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

  private normalizeUserDoc(doc: any): User | undefined {
    if (!doc) {
      return undefined;
    }

    const normalized: any = {
      ...doc,
      id: doc.id ?? doc.user_id ?? doc._id?.toString(),
      fullName: doc.fullName ?? doc.full_name ?? doc.name ?? 'User',
      email: doc.email?.toLowerCase() ?? doc.email,
      age: doc.age ?? 35,
      gender: doc.gender ?? 'Female',
      weight: doc.weight ?? 70,
      height: doc.height ?? 165,
      phone: doc.phone ?? '',
      role: doc.role ?? 'Patient',
      createdAt: doc.createdAt ?? doc.registered_at ?? new Date().toISOString(),
    };

    if (!normalized.passwordHash && normalized.password_hash) {
      normalized.passwordHash = normalized.password_hash;
    }

    return normalized as User;
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ready();
    const doc = await this.users?.findOne({ email: email.toLowerCase() }, { projection: { passwordHash: 0 } }) ?? undefined;
    return this.normalizeUserDoc(doc);
  }

  public async getUserById(id: string): Promise<User | undefined> {
    await this.ready();
    const doc = await this.users?.findOne({ $or: [{ id }, { user_id: id }] }, { projection: { passwordHash: 0 } }) ?? undefined;
    return this.normalizeUserDoc(doc);
  }

  public async createUser(user: User, passwordHash: string): Promise<User> {
    await this.ready();
    await this.users?.insertOne({ ...user, passwordHash });
    return user;
  }

  public async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    await this.ready();
    const result = await this.users?.findOneAndUpdate(
      { $or: [{ id }, { user_id: id }] },
      { $set: updates },
      { returnDocument: 'after', projection: { passwordHash: 0 } }
    );
    const normalizedDoc = (result as any)?.value ?? result;
    return this.normalizeUserDoc(normalizedDoc) ?? undefined;
  }

  public async getPasswordHash(userId: string): Promise<string | undefined> {
    await this.ready();
    const user = await this.users?.findOne(
      { $or: [{ id: userId }, { user_id: userId }] },
      { projection: { passwordHash: 1, password_hash: 1 } }
    );
    return user?.passwordHash ?? user?.password_hash;
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
