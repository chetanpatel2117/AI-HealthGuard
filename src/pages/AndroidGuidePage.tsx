/**
 * AI HealthGuard - Android Guide Page
 */

import React from 'react';
import { Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

export const AndroidGuidePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-12">
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Android Setup Guide</h1>
            <p className="text-xs text-slate-500 mt-1">Install and use AI HealthGuard on Android with confidence.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <h2 className="font-semibold text-slate-900">1. Open the app</h2>
            <p className="text-sm text-slate-600 mt-1">Launch AI HealthGuard from your Android home screen or app drawer.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <h2 className="font-semibold text-slate-900">2. Sign in or create an account</h2>
            <p className="text-sm text-slate-600 mt-1">Use your email and password to access predictions, history, and chat.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <h2 className="font-semibold text-slate-900">3. Scan reports and review insights</h2>
            <p className="text-sm text-slate-600 mt-1">Upload lab reports or enter values to get a health assessment and recommendations.</p>
          </div>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white text-sm font-semibold">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
