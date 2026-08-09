/**
 * AI HealthGuard - Desktop Navigation Sidebar Component
 */

import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Bot,
  Utensils,
  Upload,
  History,
  BarChart2,
  User,
  Smartphone,
  Shield,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, category: 'Main' },
    { id: 'predict', label: 'Diabetes Risk Test', icon: Activity, category: 'Clinical ML' },
    { id: 'ai-assistant', label: 'Gemini Health Assistant', icon: Bot, category: 'AI Intelligence' },
    { id: 'diet-exercise', label: 'Diet & Fitness Planner', icon: Utensils, category: 'Wellness' },
    { id: 'ocr', label: 'Lab Report Vision OCR', icon: Upload, category: 'Clinical ML' },
    { id: 'history', label: 'Prediction Records', icon: History, category: 'Database' },
    { id: 'profile', label: 'Patient Profile', icon: User, category: 'User' },
    
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white rounded-3xl p-5 border border-emerald-100/80 shadow-xs h-[calc(100vh-120px)] sticky top-24 justify-between">
      <div className="space-y-6">
        {/* Brand Banner */}
        <div className="flex items-center space-x-3 p-2 bg-emerald-50/60 rounded-2xl border border-emerald-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">AI HealthGuard</h3>
            <span className="text-[10px] text-emerald-700 font-semibold block">Medical Shield v2.4</span>
          </div>
        </div>

        {/* Navigation Group */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Badge */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-3.5 rounded-2xl text-[11px] space-y-1">
        <span className="flex items-center gap-1 font-bold text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Medical ML Shield
        </span>
        <p className="text-emerald-100/70 text-[10px] leading-snug">
          92.4% Voting Ensemble & Gemini Multimodal AI.
        </p>
      </div>
    </aside>
  );
};
