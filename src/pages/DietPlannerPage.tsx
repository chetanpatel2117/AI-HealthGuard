/**
 * AI HealthGuard - Diet & Exercise Planner Module
 */

import React, { useState, useEffect } from 'react';
import { Utensils, Flame, Droplet, Dumbbell, ShoppingCart, Calendar, Check, Plus, RefreshCw, Sparkles } from 'lucide-react';
import { DietPlan, ExerciseItem } from '../types';

export const DietPlannerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diet' | 'exercise' | 'shopping'>('diet');
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchDietPlan();
  }, []);

  const fetchDietPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riskLevel: 'Moderate Risk', bmi: 26.5 }),
      });
      const data = await res.json();
      setDietPlan(data);
    } catch (e) {
      console.error('Failed to load diet plan:', e);
    } finally {
      setLoading(false);
    }
  };

  const exercises: ExerciseItem[] = [
    {
      id: 'e1',
      type: 'Walking',
      durationMins: 30,
      intensity: 'Moderate',
      caloriesBurned: 140,
      recommendedForRisk: ['Low Risk', 'Moderate Risk', 'High Risk', 'Severe Risk'],
      instructions: 'Brisk 30-minute post-meal walk. Studies show light postprandial walking lowers peak glucose spikes by up to 26%.',
    },
    {
      id: 'e2',
      type: 'Cycling',
      durationMins: 25,
      intensity: 'Moderate',
      caloriesBurned: 180,
      recommendedForRisk: ['Low Risk', 'Moderate Risk', 'High Risk'],
      instructions: 'Stationary or outdoor cycling at moderate cadence to stimulate GLUT-4 glucose transporter expression in quadriceps.',
    },
    {
      id: 'e3',
      type: 'Yoga',
      durationMins: 40,
      intensity: 'Light',
      caloriesBurned: 110,
      recommendedForRisk: ['Low Risk', 'Moderate Risk', 'High Risk', 'Severe Risk'],
      instructions: 'Restorative Vinyasa or Hatha Yoga focused on diaphragmatic breathing to lower serum cortisol and autonomic stress.',
    },
    {
      id: 'e4',
      type: 'Gym Workout',
      durationMins: 45,
      intensity: 'Vigorous',
      caloriesBurned: 260,
      recommendedForRisk: ['Low Risk', 'Moderate Risk'],
      instructions: 'Compound resistance training (squats, chest press, rows) 3x per week to increase lean muscle mass and basal metabolic rate.',
    },
  ];

  const toggleShoppingCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-300 text-xs font-semibold mb-1">
            <Utensils className="w-4 h-4" />
            <span>AI Metabolic Nutrition & Workout Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Glycemic Diet & Exercise Planner</h1>
          <p className="text-xs text-teal-100/90 mt-1">
            Custom low-GI meal schedules, macronutrient breakdown, & physical fitness routines optimized for glycemic balance.
          </p>
        </div>

        <button
          onClick={fetchDietPlan}
          disabled={loading}
          className="px-4 py-2.5 rounded-2xl bg-white text-emerald-900 font-extrabold text-xs hover:bg-emerald-50 transition-colors shadow-sm shrink-0 flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Regenerate AI Plan</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('diet')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'diet' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Daily Meal Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('exercise')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'exercise' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Workout Routine</span>
        </button>

        <button
          onClick={() => setActiveTab('shopping')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'shopping' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Shopping List</span>
        </button>
      </div>

      {/* DIET TAB */}
      {activeTab === 'diet' && (
        <div className="space-y-6">
          {/* Macronutrient Target Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calories Target</span>
              <span className="text-xl font-extrabold text-slate-900">{dietPlan?.dailyCalorieTarget || 2000} kcal</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[70%]"></div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Protein</span>
              <span className="text-xl font-extrabold text-slate-900">{dietPlan?.proteinTargetG || 110}g</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-500 h-full w-[65%]"></div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Carbohydrates</span>
              <span className="text-xl font-extrabold text-slate-900">{dietPlan?.carbsTargetG || 160}g</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full w-[50%]"></div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Healthy Fat</span>
              <span className="text-xl font-extrabold text-slate-900">{dietPlan?.fatTargetG || 65}g</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-teal-500 h-full w-[60%]"></div>
              </div>
            </div>
          </div>

          {/* Today's Meals Cards */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Today's Low-GI Meal Recommendations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dietPlan?.meals.map((meal) => (
                <div key={meal.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {meal.mealType}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{meal.calories} kcal</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{meal.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{meal.description}</p>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Protein: {meal.proteinG}g</span>
                    <span>Carbs: {meal.carbsG}g</span>
                    <span>Fat: {meal.fatG}g</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      GI: {meal.glycemicIndex}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Schedule Table */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" /> Weekly Low-GI Diet Schedule
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3">Day</th>
                    <th className="pb-3">Breakfast</th>
                    <th className="pb-3">Lunch</th>
                    <th className="pb-3">Dinner</th>
                    <th className="pb-3">Snack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {dietPlan?.weeklyMealSchedule.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-emerald-800">{row.day}</td>
                      <td className="py-3">{row.breakfast}</td>
                      <td className="py-3">{row.lunch}</td>
                      <td className="py-3">{row.dinner}</td>
                      <td className="py-3 text-slate-500">{row.snack}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EXERCISE TAB */}
      {activeTab === 'exercise' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {ex.type}
                </span>
                <span className="text-xs font-extrabold text-orange-600 flex items-center gap-1">
                  <Flame className="w-4 h-4" /> ~{ex.caloriesBurned} kcal
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-extrabold text-slate-900">{ex.durationMins} Mins</span>
                <span className="text-xs font-semibold text-slate-400">({ex.intensity} Intensity)</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {ex.instructions}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Recommended for all prediabetes risk cohorts.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SHOPPING LIST TAB */}
      {activeTab === 'shopping' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-600" /> AI-Generated Metabolic Grocery Shopping List
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Whole food ingredients curated specifically for glycemic control and anti-inflammatory metabolic nutrition.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dietPlan?.shoppingList.map((item, idx) => {
              const isDone = checkedItems[item];
              return (
                <div
                  key={idx}
                  onClick={() => toggleShoppingCheck(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isDone ? 'bg-emerald-50/60 border-emerald-200 text-slate-400 line-through' : 'bg-slate-50 border-slate-100 text-slate-800 hover:border-emerald-300'
                  }`}
                >
                  <span className="text-xs font-semibold">{item}</span>
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                    isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isDone && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
