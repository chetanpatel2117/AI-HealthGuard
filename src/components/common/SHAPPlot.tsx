/**
 * AI HealthGuard - SHAP Explainable AI Chart Component
 */

import React from 'react';
import { SHAPContribution } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { HelpCircle, Sparkles } from 'lucide-react';

interface SHAPPlotProps {
  contributions: SHAPContribution[];
}

export const SHAPPlot: React.FC<SHAPPlotProps> = ({ contributions }) => {
  const chartData = contributions.map((c) => ({
    name: c.displayName,
    shap: Number((c.shapValue * 100).toFixed(1)),
    value: c.value,
    impact: c.impact,
    explanation: c.explanation,
  }));

  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" /> SHAP Feature Impact Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Explainable AI showing how each medical parameter shifted the risk score away from base population average.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Game-Theory SHAP
        </span>
      </div>

      {/* SHAP Bar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#64748b' }} domain={['dataMin - 5', 'dataMax + 5']} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} width={130} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-3 rounded-2xl shadow-xl max-w-xs border border-slate-700">
                      <p className="font-bold border-b border-slate-700 pb-1 mb-1">{data.name}</p>
                      <p className="text-slate-300">Measured Value: <strong className="text-emerald-400">{data.value}</strong></p>
                      <p className="text-slate-300">SHAP Risk Impact: <strong className={data.shap > 0 ? 'text-rose-400' : 'text-emerald-400'}>{data.shap > 0 ? `+${data.shap}%` : `${data.shap}%`}</strong></p>
                      <p className="mt-1 text-[11px] text-slate-400 leading-snug">{data.explanation}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={0} stroke="#94a3b8" strokeDasharray="3 3" />
            <Bar dataKey="shap" radius={[0, 6, 6, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.shap > 0 ? '#f43f5e' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table Explanation */}
      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Top Risk Contributors
        </h4>
        {contributions.slice(0, 4).map((c, idx) => (
          <div key={idx} className="flex items-start justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100/80 text-xs">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{c.displayName}</span>
                <span className="text-slate-500 font-medium bg-slate-200/60 px-2 py-0.5 rounded-full text-[10px]">
                  {c.value}
                </span>
              </div>
              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{c.explanation}</p>
            </div>
            <div className="text-right ml-4">
              <span className={`font-bold text-xs ${c.shapValue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {c.shapValue > 0 ? `+${Math.round(c.shapValue * 100)}%` : `${Math.round(c.shapValue * 100)}%`}
              </span>
              <span className="block text-[10px] text-slate-400 font-medium mt-0.5">{c.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
