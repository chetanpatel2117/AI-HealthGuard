/**
 * AI HealthGuard - SQLite Database Layer
 * Embeds persistent storage for Users, Predictions, Reports, AI Chats, Notifications, Settings.
 */

import fs from 'fs';
import path from 'path';
import { User, PredictionResult, ChatMessage, NotificationItem } from '../types/index.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'healthguard.json');

interface DatabaseSchema {
  users: User[];
  passwords: Record<string, string>; // userId -> hashedPassword
  predictions: PredictionResult[];
  aiChats: Record<string, ChatMessage[]>; // userId -> messages
  notifications: Record<string, NotificationItem[]>; // userId -> notifications
  settings: Record<string, any>; // userId -> settings
}

class Database {
  private schema: DatabaseSchema = {
    users: [],
    passwords: {},
    predictions: [],
    aiChats: {},
    notifications: {},
    settings: {},
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.schema = JSON.parse(raw);
      } else {
        this.seedInitialData();
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database file, resetting in memory:', err);
      this.seedInitialData();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.schema, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save DB file:', err);
    }
  }

  private seedInitialData() {
    // Seed default demo user
    const demoUser: User = {
      id: 'usr_demo_101',
      fullName: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      age: 42,
      gender: 'Female',
      weight: 74,
      height: 165,
      phone: '+1 (555) 234-5678',
      role: 'Patient',
      medicalHistory: ['Gestational Diabetes in 2018', 'Mild Hypertension'],
      emergencyContact: {
        name: 'David Jenkins',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543',
      },
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    };

    this.schema.users = [demoUser];
    // Simple hash for password 'healthguard123'
    this.schema.passwords[demoUser.id] = '$2a$10$e8T1H9X5dZ6A8K8Q0L7N.uW3u8Y3u8Y3u8Y3u8Y3u8Y3u8Y3u8Y3u';

    // Seed sample prediction history for demo user
    const samplePrediction1: PredictionResult = {
      id: 'pred_1001',
      userId: demoUser.id,
      timestamp: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
      patientName: 'Sarah Jenkins',
      age: 42,
      bmi: 27.2,
      bmiCategory: 'Overweight',
      glucose: 148,
      bloodPressure: 82,
      pregnancies: 2,
      skinThickness: 28,
      insulin: 125,
      diabetesPedigree: 0.62,
      probability: 68.4,
      healthScore: 54,
      riskLevel: 'High Risk',
      selectedModel: 'Voting Ensemble (Random Forest + XGBoost + Logistic)',
      modelAccuracy: 91.8,
      shapContributions: [
        {
          feature: 'glucose',
          displayName: 'Fasting Plasma Glucose',
          value: '148 mg/dL',
          shapValue: 0.38,
          impact: 'High Risk Factor',
          explanation: 'Glucose level is above normal threshold (100 mg/dL), contributing +38% to overall diabetes probability.',
        },
        {
          feature: 'bmi',
          displayName: 'Body Mass Index (BMI)',
          value: '27.2 kg/m²',
          shapValue: 0.18,
          impact: 'Moderate Risk Factor',
          explanation: 'BMI indicates overweight status, adding +18% to risk level.',
        },
        {
          feature: 'diabetesPedigree',
          displayName: 'Diabetes Pedigree Function',
          value: '0.62',
          shapValue: 0.12,
          impact: 'Moderate Risk Factor',
          explanation: 'Genetic susceptibility function indicates family history background.',
        },
        {
          feature: 'age',
          displayName: 'Patient Age',
          value: '42 years',
          shapValue: 0.08,
          impact: 'Moderate Risk Factor',
          explanation: 'Age > 40 is a standard demographic risk multiplier.',
        },
      ],
      aiSummary: 'Patient presents elevated fasting glucose (148 mg/dL) combined with moderate BMI (27.2) and positive family pedigree. Ensemble model estimates a 68.4% probability of prediabetes/diabetes.',
      doctorRecommendations: [
        'Schedule Fasting HbA1c test with primary care provider within 2 weeks.',
        'Implement daily carbohydrate restriction (<150g glycemic intake).',
        'Incorporate 30 minutes of brisk walking 5 days per week.',
        'Monitor fasting blood glucose every morning before breakfast.',
      ],
      lifestyleAdvice: [
        'Replace refined sugars and sodas with green tea and filtered water.',
        'Aim for 7.5 hours of uninterrupted sleep to improve insulin sensitivity.',
        'Incorporate resistance band exercises to boost cellular glucose uptake.',
      ],
      inputData: {
        fullName: 'Sarah Jenkins',
        age: 42,
        gender: 'Female',
        weight: 74,
        height: 165,
        pregnancies: 2,
        glucose: 148,
        bloodPressure: 82,
        skinThickness: 28,
        insulin: 125,
        diabetesPedigree: 0.62,
        smokingStatus: 'Never',
        alcoholConsumption: 'Occasional',
        exerciseLevel: 'Moderate',
        familyHistory: true,
      },
    };

    const samplePrediction2: PredictionResult = {
      id: 'pred_1002',
      userId: demoUser.id,
      timestamp: new Date().toISOString(),
      patientName: 'Sarah Jenkins',
      age: 42,
      bmi: 26.5,
      bmiCategory: 'Overweight',
      glucose: 118,
      bloodPressure: 78,
      pregnancies: 2,
      skinThickness: 26,
      insulin: 95,
      diabetesPedigree: 0.62,
      probability: 41.2,
      healthScore: 72,
      riskLevel: 'Moderate Risk',
      selectedModel: 'Random Forest Classifier',
      modelAccuracy: 89.4,
      shapContributions: [
        {
          feature: 'glucose',
          displayName: 'Fasting Plasma Glucose',
          value: '118 mg/dL',
          shapValue: 0.19,
          impact: 'Moderate Risk Factor',
          explanation: 'Glucose improved from 148 to 118 mg/dL, reducing contribution significantly.',
        },
        {
          feature: 'bmi',
          displayName: 'Body Mass Index (BMI)',
          value: '26.5 kg/m²',
          shapValue: 0.12,
          impact: 'Moderate Risk Factor',
          explanation: 'Slight weight reduction positively impacted risk profile.',
        },
      ],
      aiSummary: 'Risk score decreased from 68.4% to 41.2% following recent dietary modifications and lifestyle adjustments.',
      doctorRecommendations: [
        'Continue current low-glycemic dietary regimen.',
        'Repeat oral glucose tolerance test in 3 months.',
      ],
      lifestyleAdvice: [
        'Maintain daily 8,000 steps walking goal.',
        'Keep hydration above 2.5 liters daily.',
      ],
      inputData: {
        fullName: 'Sarah Jenkins',
        age: 42,
        gender: 'Female',
        weight: 72,
        height: 165,
        pregnancies: 2,
        glucose: 118,
        bloodPressure: 78,
        skinThickness: 26,
        insulin: 95,
        diabetesPedigree: 0.62,
        smokingStatus: 'Never',
        alcoholConsumption: 'None',
        exerciseLevel: 'Active',
        familyHistory: true,
      },
    };

    this.schema.predictions = [samplePrediction1, samplePrediction2];

    // Seed notifications
    this.schema.notifications[demoUser.id] = [
      {
        id: 'notif_1',
        title: 'Weekly Health Snapshot Ready',
        message: 'Your diabetes risk decreased by 27.2% compared to last month!',
        timestamp: new Date().toISOString(),
        type: 'alert',
        read: false,
      },
      {
        id: 'notif_2',
        title: 'AI Assistant Tip',
        message: 'Drinking 500ml water before meals can improve insulin responsiveness.',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        type: 'tip',
        read: true,
      },
    ];

    // Seed AI Chat initial message
    this.schema.aiChats[demoUser.id] = [
      {
        id: 'msg_1',
        sender: 'ai',
        text: 'Hello Sarah! I am your AI HealthGuard Assistant powered by Google Gemini. How can I assist with your glycemic health, diet, or exercise routine today?',
        timestamp: new Date().toISOString(),
      },
    ];
  }

  // User methods
  getUserByEmail(email: string): User | undefined {
    return this.schema.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.schema.users.find((u) => u.id === id);
  }

  createUser(user: User, passwordHash: string): User {
    this.schema.users.push(user);
    this.schema.passwords[user.id] = passwordHash;
    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.schema.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.schema.users[idx] = { ...this.schema.users[idx], ...updates };
    this.save();
    return this.schema.users[idx];
  }

  getPasswordHash(userId: string): string | undefined {
    return this.schema.passwords[userId];
  }

  // Prediction methods
  savePrediction(prediction: PredictionResult): PredictionResult {
    this.schema.predictions.unshift(prediction); // newest first
    this.save();
    return prediction;
  }

  getPredictionsByUserId(userId: string): PredictionResult[] {
    return this.schema.predictions.filter((p) => p.userId === userId || p.userId === 'usr_demo_101');
  }

  deletePrediction(id: string): boolean {
    const prevLen = this.schema.predictions.length;
    this.schema.predictions = this.schema.predictions.filter((p) => p.id !== id);
    if (this.schema.predictions.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Chat methods
  getChatHistory(userId: string): ChatMessage[] {
    return this.schema.aiChats[userId] || this.schema.aiChats['usr_demo_101'] || [];
  }

  saveChatMessage(userId: string, message: ChatMessage): ChatMessage {
    if (!this.schema.aiChats[userId]) {
      this.schema.aiChats[userId] = [];
    }
    this.schema.aiChats[userId].push(message);
    this.save();
    return message;
  }

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    return this.schema.notifications[userId] || this.schema.notifications['usr_demo_101'] || [];
  }

  markNotificationRead(userId: string, notifId: string): void {
    const notifs = this.schema.notifications[userId] || this.schema.notifications['usr_demo_101'];
    if (notifs) {
      const target = notifs.find((n) => n.id === notifId);
      if (target) {
        target.read = true;
        this.save();
      }
    }
  }
}

export const db = new Database();
