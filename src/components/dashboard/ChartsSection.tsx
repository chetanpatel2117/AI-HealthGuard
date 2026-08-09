/**
 * AI HealthGuard - Interactive Analytics Charts Section
 */

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';

interface ChartDataItem {
  label: string;
  risk: number;
  glucose: number;
  bmi: number;
}

export const ChartsSection: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const weeklyData: ChartDataItem[] = [
    { label: 'Mon', risk: 68.4, glucose: 148, bmi: 27.2 },
    { label: 'Tue', risk: 62.1, glucose: 138, bmi: 27.1 },
    { label: 'Wed', risk: 58.0, glucose: 130, bmi: 27.0 },
    { label: 'Thu', risk: 51.5, glucose: 125, bmi: 26.8 },
    { label: 'Fri', risk: 46.2, glucose: 122, bmi: 26.6 },
    { label: 'Sat', risk: 43.0, glucose: 120, bmi: 26.5 },
    { label: 'Sun', risk: 41.2, glucose: 118, bmi: 26.5 },
  ];

  const monthlyData: ChartDataItem[] = [
    { label: 'Jan', risk: 78.5, glucose: 165, bmi: 28.5 },
    { label: 'Feb', risk: 72.0, glucose: 154, bmi: 28.1 },
    { label: 'Mar', risk: 68.4, glucose: 148, bmi: 27.6 },
    { label: 'Apr', risk: 59.2, glucose: 135, bmi: 27.2 },
    { label: 'May', risk: 48.0, glucose: 124, bmi: 26.8 },
    { label: 'Jun', risk: 41.2, glucose: 118, bmi: 26.5 },
  ];

  const pieData = [
    { name: 'Low Risk', value: 42, color: '#10b981' },
    { name: 'Moderate Risk', value: 31, color: '#eab308' },
    { name: 'High Risk', value: 18, color: '#f97316' },
    { name: 'Severe Risk', value: 9, color: '#f43f5e' },
  ];

  const currentData = timeframe === 'weekly' ? weeklyData : monthlyData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Risk & Glucose Trend Chart */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Diabetes Risk & Glucose Progression
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical progression of ML estimated risk score vs fasting glucose level (mg/dL).
            </p>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/60 self-stretch sm:self-auto">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                timeframe === 'weekly' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              7-Day Trend
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                timeframe === 'monthly' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              6-Month Trend
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ChartDataItem;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs border border-slate-700">
                        <p className="font-bold border-b border-slate-700 pb-1 mb-1">{data.label}</p>
                        <p className="text-emerald-400">Risk Probability: <strong>{data.risk}%</strong></p>
                        <p className="text-blue-400">Fasting Glucose: <strong>{data.glucose} mg/dL</strong></p>
                        <p className="text-amber-400">BMI: <strong>{data.bmi} kg/m²</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="risk" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" name="Risk Score (%)" />
              <Area type="monotone" dataKey="glucose" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorGlucose)" name="Glucose (mg/dL)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-6 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> ML Risk Score (%)
          </span>
          <span className="flex items-center gap-1.5 text-blue-700">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Fasting Glucose (mg/dL)
          </span>
        </div>
      </div>

      {/* Risk Distribution Pie Chart */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-emerald-600" /> Patient Risk Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical risk cohort distribution across analyzed demographics.
          </p>

          <div className="h-52 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs">
                          {data.name}: <strong>{data.value}%</strong>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-1.5 border-t border-slate-100 pt-3">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                {item.name}
              </span>
              <span className="text-slate-900 font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
