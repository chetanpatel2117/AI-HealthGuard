/**
 * AI HealthGuard - Health Snapshot Vitals & Metrics Tracker
 */

import React, { useState } from 'react';
import { Activity, Droplet, Heart, Scale, Flame, Plus, Check } from 'lucide-react';
import { HealthSnapshot as SnapshotType } from '../../types';

interface HealthSnapshotProps {
  snapshot?: SnapshotType;
}

export const HealthSnapshotCard: React.FC<HealthSnapshotProps> = ({ snapshot }) => {
  const [waterMl, setWaterMl] = useState(snapshot?.waterIntakeMl || 2100);
  const [steps, setSteps] = useState(snapshot?.dailySteps || 8420);

  const addWater = (amount: number) => {
    setWaterMl((prev) => Math.min(4000, prev + amount));
  };

  const glucose = snapshot?.currentGlucose || 118;
  const bmi = snapshot?.bmi || 26.5;
  const riskScore = snapshot?.recentRiskScore || 41.2;
  const riskLevel = snapshot?.recentRiskLevel || 'Moderate Risk';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Risk Score */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Diabetes Risk</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-extrabold text-slate-900">{riskScore}%</span>
          <span className="text-[11px] font-bold block mt-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 w-max border border-amber-200">
            {riskLevel}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">Tested 2 days ago</p>
      </div>

      {/* Glucose */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fasting Glucose</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Droplet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold text-slate-900">{glucose}</span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          <span className={`text-[11px] font-bold block mt-1 px-2.5 py-0.5 rounded-full w-max border ${
            glucose > 125 ? 'bg-rose-50 text-rose-700 border-rose-200' : glucose > 99 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {glucose > 125 ? 'Elevated' : glucose > 99 ? 'Prediabetes' : 'Normal'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">Target: &lt;100 mg/dL</p>
      </div>

      {/* Blood Pressure */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Pressure</span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold text-slate-900">120/80</span>
            <span className="text-xs font-semibold text-slate-500">mmHg</span>
          </div>
          <span className="text-[11px] font-bold block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 w-max">
            Optimal
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">Diastolic & Systolic</p>
      </div>

      {/* BMI */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Body Mass Index</span>
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold text-slate-900">{bmi}</span>
            <span className="text-xs font-semibold text-slate-500">kg/m²</span>
          </div>
          <span className="text-[11px] font-bold block mt-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 w-max">
            Overweight
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">Target: 18.5 - 24.9</p>
      </div>

      {/* Daily Steps Tracker */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Steps</span>
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900">{steps.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-semibold">/ 10,000</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }}
            ></div>
          </div>
        </div>
        <p className="text-[11px] text-emerald-600 font-medium mt-2">🔥 320 kcal burned today</p>
      </div>

      {/* Water Intake Quick Logger */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Hydration</span>
          <button
            onClick={() => addWater(250)}
            className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
            title="Add 250ml"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900">{(waterMl / 1000).toFixed(1)}L</span>
            <span className="text-xs text-slate-400 font-semibold">/ 3.0L Target</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (waterMl / 3000) * 100)}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={() => addWater(250)}
          className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Log +250ml Water
        </button>
      </div>
    </div>
  );
};
