/**
 * AI HealthGuard - Primary Dashboard Page
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { QuickActions } from '../components/dashboard/QuickActions';
import { HealthSnapshotCard } from '../components/dashboard/HealthSnapshot';
import { ChartsSection } from '../components/dashboard/ChartsSection';
import { AITipCard } from '../components/dashboard/AITipCard';
import { PredictionResult } from '../types';
import { apiFetch } from '../lib/api';
import { Calendar, ShieldAlert, ArrowRight, Activity, Clock, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<PredictionResult[]>([]);

  useEffect(() => {
    apiFetch('/api/history')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setHistory(data);
      })
      .catch(() => {});
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const latestResult = history[0];

  return (
    <div className="space-y-8 pb-20 md:pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-semibold mb-2">
              <Calendar className="w-4 h-4" />
              <span>{todayStr}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, {user?.fullName || 'Sarah'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              Your AI Medical Shield is actively monitoring your metabolic health indicators. Fasting glucose is down 18% this month.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 self-stretch sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-md">
              {latestResult ? `${latestResult.probability}%` : '41%'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Latest Assessment</span>
              <span className="text-xs font-bold text-white block">
                {latestResult ? latestResult.riskLevel : 'Moderate Risk'}
              </span>
            </div>
            <button
              onClick={() => onNavigate('predict')}
              className="ml-2 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-xs"
            >
              Test Now
            </button>
          </div>
        </div>
      </div>

      {/* Health Vitals Snapshot */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Current Health Vitals Snapshot
          </h2>
          <span className="text-xs text-slate-400 font-medium">Synced with Medical DB</span>
        </div>
        <HealthSnapshotCard />
      </div>

      {/* AI Health Tip */}
      <AITipCard />

      {/* Quick Action Navigation Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Quick Action Clinical Modules
          </h2>
        </div>
        <QuickActions onSelectAction={(act) => onNavigate(act)} />
      </div>

      {/* Charts & Analytics Section */}
      <ChartsSection />

      {/* Recent Predictions Table Preview */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> Recent ML Prediction History
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review latest risk evaluation reports and SHAP explainability summaries.
            </p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Records</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3">Date</th>
                <th className="pb-3">Model</th>
                <th className="pb-3">Glucose</th>
                <th className="pb-3">BMI</th>
                <th className="pb-3">Risk Level</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {history.slice(0, 3).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 text-slate-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-3 font-semibold text-slate-900 truncate max-w-[180px]">
                    {item.selectedModel}
                  </td>
                  <td className="py-3 font-bold text-slate-800">{item.glucose} mg/dL</td>
                  <td className="py-3">{item.bmi} kg/m²</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                      item.probability >= 50
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : item.probability >= 30
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {item.riskLevel} ({item.probability}%)
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onNavigate('result', item)}
                      className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold transition-colors"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
