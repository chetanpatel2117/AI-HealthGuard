/**
 * AI HealthGuard - Circular / Arc Risk Gauge Component
 */

import React from 'react';
import { RiskLevel } from '../../types';

interface RiskGaugeProps {
  probability: number; // 0 to 100%
  healthScore?: number; // 0 to 100
  riskLevel: RiskLevel;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ probability, healthScore = 75, riskLevel, size = 260 }) => {
  // Angle calculation (-90 to +90 degrees)
  const clampedProb = Math.min(100, Math.max(0, probability));
  const angle = -90 + (clampedProb / 100) * 180;

  // Get color based on risk level
  const getRiskColor = () => {
    if (clampedProb >= 70) return { main: '#e11d48', bg: 'bg-rose-50 text-rose-700 border-rose-200' }; // Severe
    if (clampedProb >= 50) return { main: '#f97316', bg: 'bg-amber-50 text-amber-700 border-amber-200' }; // High
    if (clampedProb >= 30) return { main: '#eab308', bg: 'bg-yellow-50 text-yellow-700 border-yellow-200' }; // Moderate
    return { main: '#059669', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }; // Low
  };

  const colors = getRiskColor();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.65 }}>
        <svg width={size} height={size * 0.7} viewBox="0 0 200 130" className="overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#eab308" />
              <stop offset="65%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Colored Gauge Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Ticks */}
          <line x1="20" y1="110" x2="12" y2="110" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="100" y1="30" x2="100" y2="22" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="180" y1="110" x2="188" y2="110" stroke="#cbd5e1" strokeWidth="2" />

          {/* Needle Pointer */}
          <g transform={`rotate(${angle}, 100, 110)`} filter="url(#needleShadow)" className="transition-all duration-1000 ease-out">
            <line x1="100" y1="110" x2="100" y2="38" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="110" r="8" fill="#1e293b" />
            <circle cx="100" cy="110" r="3" fill="#ffffff" />
          </g>
        </svg>

        {/* Center Probability Number */}
        <div className="absolute bottom-0 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {clampedProb}%
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Risk Score
          </span>
        </div>
      </div>

      {/* Risk Badge */}
      <div className="mt-3 flex items-center gap-3">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${colors.bg}`}>
          {riskLevel}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          Health Score: <strong className="text-emerald-700">{healthScore}/100</strong>
        </span>
      </div>
    </div>
  );
};
