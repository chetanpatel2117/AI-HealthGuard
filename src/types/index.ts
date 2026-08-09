/**
 * AI HealthGuard - Primary Type Definitions
 */

export type RiskLevel = 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Severe Risk';

export interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number; // in kg
  height: number; // in cm
  phone?: string;
  avatarUrl?: string;
  role: 'Patient' | 'Doctor' | 'Admin';
  medicalHistory?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  createdAt: string;
}

export interface PredictionInput {
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number; // kg
  height: number; // cm
  pregnancies: number;
  glucose: number; // mg/dL
  bloodPressure: number; // mmHg
  skinThickness: number; // mm
  insulin: number; // mu U/ml
  diabetesPedigree: number; // pedigree function (e.g., 0.45)
  smokingStatus: 'Never' | 'Former' | 'Current';
  alcoholConsumption: 'None' | 'Occasional' | 'Regular';
  exerciseLevel: 'Sedentary' | 'Moderate' | 'Active';
  familyHistory: boolean;
  selectedModel?: string;
}

export interface SHAPContribution {
  feature: string;
  displayName: string;
  value: number | string;
  shapValue: number; // positive increases risk, negative decreases risk
  impact: 'High Risk Factor' | 'Moderate Risk Factor' | 'Protective Factor';
  explanation: string;
}

export interface PredictionResult {
  id: string;
  userId: string;
  timestamp: string;
  patientName: string;
  age: number;
  bmi: number;
  bmiCategory: string;
  glucose: number;
  bloodPressure: number;
  pregnancies: number;
  skinThickness: number;
  insulin: number;
  diabetesPedigree: number;
  probability: number; // 0 to 100%
  healthScore: number; // 0 to 100
  riskLevel: RiskLevel;
  selectedModel: string;
  modelAccuracy: number;
  shapContributions: SHAPContribution[];
  aiSummary: string;
  doctorRecommendations: string[];
  lifestyleAdvice: string[];
  inputData: PredictionInput;
  backendMetadata?: {
    engine?: string;
    shapFramework?: string;
    executionTimeMs?: number;
    dataset?: string;
  };
}

export interface PythonStatus {
  status: string;
  backend: string;
  pythonVersion: string;
  executable: string;
  architecture: string;
  algorithms: string[];
  timestamp: string;
  latencyMs?: number;
}

export interface MLModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
}

export interface MLBenchmark {
  bestModel: string;
  datasetSize: number;
  featuresCount: number;
  models: MLModelMetrics[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  category?: 'General' | 'Diet' | 'Exercise' | 'Report';
}

export interface MealItem {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  title: string;
  description: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  glycemicIndex: 'Low' | 'Medium' | 'High';
}

export interface DietPlan {
  dailyCalorieTarget: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
  waterIntakeLiters: number;
  meals: MealItem[];
  shoppingList: string[];
  weeklyMealSchedule: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  }[];
}

export interface ExerciseItem {
  id: string;
  type: 'Walking' | 'Running' | 'Cycling' | 'Yoga' | 'Stretching' | 'Gym Workout';
  durationMins: number;
  intensity: 'Light' | 'Moderate' | 'Vigorous';
  caloriesBurned: number;
  recommendedForRisk: RiskLevel[];
  instructions: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'reminder' | 'tip' | 'report';
  read: boolean;
}

export interface LabReportExtracted {
  patientName?: string;
  age?: number;
  gender?: 'Male' | 'Female';
  glucose?: number;
  bloodPressure?: number;
  hba1c?: number;
  insulin?: number;
  skinThickness?: number;
  bmi?: number;
  confidenceScore: number;
  notes: string[];
}

export interface HealthSnapshot {
  recentRiskScore: number;
  recentRiskLevel: RiskLevel;
  currentGlucose: number; // mg/dL
  currentBP: string; // e.g. "120/80"
  bmi: number;
  bmiCategory: string;
  dailySteps: number;
  waterIntakeMl: number;
  lastTestDate: string;
}
