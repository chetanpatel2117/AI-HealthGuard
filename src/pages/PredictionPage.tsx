/**
 * AI HealthGuard - Diabetes Prediction Form Page
 */

import React, { useState } from 'react';
import { Activity, Cpu, Upload, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { PredictionInput } from '../types';
import { MLEngine } from '../server/mlEngine';

interface PredictionPageProps {
  onPredictSuccess: (result: any) => void;
  onNavigateToOCR: () => void;
  prefillData?: Partial<PredictionInput>;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({
  onPredictSuccess,
  onNavigateToOCR,
  prefillData,
}) => {
  const [formData, setFormData] = useState<PredictionInput>({
    fullName: prefillData?.fullName || '',
    age: prefillData?.age || 0,
    gender: prefillData?.gender || 'Female',
    weight: prefillData?.weight || 0,
    height: prefillData?.height || 0,
    pregnancies: prefillData?.pregnancies !== undefined ? prefillData.pregnancies : 0,
    glucose: prefillData?.glucose || 0,
    bloodPressure: prefillData?.bloodPressure || 0,
    skinThickness: prefillData?.skinThickness || 0,
    insulin: prefillData?.insulin || 0,
    diabetesPedigree: prefillData?.diabetesPedigree || 0,
    smokingStatus: prefillData?.smokingStatus || 'Never',
    alcoholConsumption: prefillData?.alcoholConsumption || 'None',
    exerciseLevel: prefillData?.exerciseLevel || 'Moderate',
    familyHistory: prefillData?.familyHistory !== undefined ? prefillData.familyHistory : false,
    selectedModel: 'Voting Ensemble (Random Forest + XGBoost + Logistic)',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Automatically calculate BMI
  const { bmi, category: bmiCategory } = MLEngine.calculateBMI(formData.weight, formData.height);

  const handleChange = (field: keyof PredictionInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Prediction request failed');
      }

      const result = await res.json();
      onPredictSuccess(result);
    } catch (err: any) {
      setError('Prediction request failed. Please verify the entered values and try again.');
      const localResult = MLEngine.predict(formData);
      onPredictSuccess(localResult);
    } finally {
      setLoading(false);
    }
  };

  const modelOptions = [
    'Voting Ensemble (Random Forest + XGBoost + Logistic)',
    'XGBoost Classifier (91.1% Accuracy)',
    'Random Forest Classifier (89.6% Accuracy)',
    'Support Vector Machine (SVM)',
    'Logistic Regression',
    'Decision Tree Classifier',
    'K-Nearest Neighbors (KNN)',
    'Gaussian Naive Bayes',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" /> AI Diabetes Risk Assessment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Input patient clinical metrics to generate an ensemble Machine Learning prediction with SHAP feature attributions.
          </p>
        </div>

        <button
          onClick={onNavigateToOCR}
          className="px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors flex items-center space-x-2 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Auto-Fill from Lab Report (OCR)</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
        {/* Section 1: Patient Information */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            1. Patient Demographics & Body Metrics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                min="1"
                max="120"
                required
                value={formData.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.weight}
                onChange={(e) => handleChange('weight', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                required
                value={formData.height}
                onChange={(e) => handleChange('height', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Calculated BMI Badge */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calculated BMI</label>
              <div className="w-full px-3.5 py-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs flex items-center justify-between font-bold text-emerald-900">
                <span>{bmi} kg/m²</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-800">
                  {bmiCategory}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Vitals & Lab Measurements */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            2. Clinical & Metabolic Lab Metrics (Pima Parameters)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fasting Glucose (mg/dL) *
              </label>
              <input
                type="number"
                required
                value={formData.glucose}
                onChange={(e) => handleChange('glucose', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 70 - 99 mg/dL</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diastolic Blood Pressure (mmHg)
              </label>
              <input
                type="number"
                required
                value={formData.bloodPressure}
                onChange={(e) => handleChange('bloodPressure', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 60 - 80 mmHg</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                2-Hour Serum Insulin (µU/ml)
              </label>
              <input
                type="number"
                required
                value={formData.insulin}
                onChange={(e) => handleChange('insulin', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 16 - 166 µU/ml</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skin Thickness / Triceps (mm)
              </label>
              <input
                type="number"
                required
                value={formData.skinThickness}
                onChange={(e) => handleChange('skinThickness', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diabetes Pedigree Function (DPF)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.diabetesPedigree}
                onChange={(e) => handleChange('diabetesPedigree', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Genetic history score (0.08 - 2.4)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pregnancies Count</label>
              <input
                type="number"
                min="0"
                value={formData.pregnancies}
                onChange={(e) => handleChange('pregnancies', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Lifestyle Factors */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            3. Lifestyle & Family History
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Smoking Status</label>
              <select
                value={formData.smokingStatus}
                onChange={(e) => handleChange('smokingStatus', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="Never">Never</option>
                <option value="Former">Former</option>
                <option value="Current">Current</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alcohol Use</label>
              <select
                value={formData.alcoholConsumption}
                onChange={(e) => handleChange('alcoholConsumption', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="None">None</option>
                <option value="Occasional">Occasional</option>
                <option value="Regular">Regular</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Activity</label>
              <select
                value={formData.exerciseLevel}
                onChange={(e) => handleChange('exerciseLevel', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="Sedentary">Sedentary (&lt;1 day/wk)</option>
                <option value="Moderate">Moderate (2-3 days/wk)</option>
                <option value="Active">Active (4+ days/wk)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Family History of Diabetes</label>
              <select
                value={formData.familyHistory ? 'Yes' : 'No'}
                onChange={(e) => handleChange('familyHistory', e.target.value === 'Yes')}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 bg-white font-semibold text-slate-900"
              >
                <option value="Yes">Yes (Immediate family)</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Model Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-600" /> Select Machine Learning Model Engine
          </label>
          <select
            value={formData.selectedModel}
            onChange={(e) => handleChange('selectedModel', e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-emerald-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-bold bg-emerald-50/50"
          >
            {modelOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>{loading ? 'Executing ML Ensemble & SHAP Engine...' : 'Predict Diabetes Risk & Generate SHAP Report'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
