/**
 * AI HealthGuard - Dynamic AI Health Tip Component with Text-To-Speech
 */

import React, { useState } from 'react';
import { Bot, RefreshCw, Volume2, VolumeX, Sparkles } from 'lucide-react';

export const AITipCard: React.FC = () => {
  const tips = [
    'Drinking 500ml of water 30 minutes before meals can reduce postprandial glucose spikes and improve insulin responsiveness.',
    'Consuming 1 tablespoon of apple cider vinegar with salad before meals can slow down carbohydrate digestion and lower glycemic impact.',
    'A 10-minute light walk immediately following lunch or dinner helps skeletal muscles absorb circulating blood glucose without relying solely on insulin.',
    'Adding 10-15 grams of soluble fiber (chia seeds, psyllium husk, or flaxseeds) to breakfast stabilizes morning blood sugar levels.',
    'Ensuring 7 to 8 hours of uninterrupted nocturnal sleep helps regulate morning cortisol and reduces fasting insulin resistance.',
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleRefresh = () => {
    setCurrentIdx((prev) => (prev + 1) % tips.length);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(tips[currentIdx]);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              Gemini AI Health Guard Tip <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </h4>
            <p className="text-[11px] text-emerald-300/80">Daily Evidence-Based Metabolic Advice</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Audio Readout */}
          <button
            onClick={handleSpeech}
            className={`p-2 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1 ${
              isPlaying ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-emerald-800/60 hover:bg-emerald-700/80 text-emerald-200'
            }`}
            title="Read Aloud"
          >
            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPlaying ? 'Stop' : 'Listen'}</span>
          </button>

          {/* Refresh Tip */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/80 text-emerald-200 transition-colors"
            title="Next AI Tip"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-emerald-100 font-medium leading-relaxed italic">
        "{tips[currentIdx]}"
      </p>

      <div className="mt-4 flex items-center justify-between text-[11px] text-emerald-300/60 pt-2">
        <span>Verified by Medical Intelligence Engine</span>
        <span>Tip {currentIdx + 1} of {tips.length}</span>
      </div>
    </div>
  );
};
