/**
 * AI HealthGuard - Quick Action Cards
 */

import React from 'react';
import { Activity, Bot, FileText, Utensils, Upload, History } from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectAction }) => {
  const actions = [
    {
      id: 'predict',
      title: 'New Diabetes Prediction',
      desc: 'Enter patient vitals or lab metrics for AI risk evaluation.',
      icon: Activity,
      gradient: 'from-emerald-600 to-teal-600',
      badge: 'ML Ensemble',
    },
    {
      id: 'ai-assistant',
      title: 'AI Health Assistant',
      desc: 'Chat with Gemini AI for advice, meal plans, & voice assistant.',
      icon: Bot,
      gradient: 'from-teal-600 to-cyan-600',
      badge: 'Gemini AI',
    },
    {
      id: 'ocr',
      title: 'Upload Lab Report OCR',
      desc: 'Scan blood test report images to auto-fill prediction parameters.',
      icon: Upload,
      gradient: 'from-emerald-700 to-emerald-500',
      badge: 'Vision OCR',
    },
    {
      id: 'diet-exercise',
      title: 'Diet & Fitness Planner',
      desc: 'Personalized low-GI meal schedules & glycemic workout routines.',
      icon: Utensils,
      gradient: 'from-teal-700 to-emerald-600',
      badge: 'Low-GI',
    },
    {
      id: 'history',
      title: 'Prediction Records',
      desc: 'View past health reports, search, filter, and export PDF/Excel.',
      icon: History,
      gradient: 'from-slate-700 to-slate-800',
      badge: 'SQLite DB',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <div
            key={act.id}
            onClick={() => onSelectAction(act.id)}
            className="group relative bg-white rounded-3xl p-5 border border-emerald-100/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${act.gradient} text-white flex items-center justify-center shadow-md shadow-emerald-600/10 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">
                  {act.badge}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {act.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {act.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>Launch Module</span>
              <span>→</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
