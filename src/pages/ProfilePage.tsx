/**
 * AI HealthGuard - User Profile & Patient Medical History Settings Page
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, Heart, Scale, Shield, Save, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [age, setAge] = useState<number>(user?.age || 0);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(user?.gender || 'Female');
  const [weight, setWeight] = useState<number>(user?.weight || 0);
  const [height, setHeight] = useState<number>(user?.height || 0);
  const [bloodGroup, setBloodGroup] = useState('O+ Positive');
  const [physician, setPhysician] = useState('');

  const [hypertension, setHypertension] = useState(true);
  const [highCholesterol, setHighCholesterol] = useState(false);
  const [familyDiabetes, setFamilyDiabetes] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);

    if (user) {
      updateUser({ fullName, email, phone, age, gender, weight, height });
    }

    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-12">
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-emerald-600/20">
            {fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{fullName}</h1>
            <p className="text-xs text-slate-500">{email} • Patient ID:usr_demo_101</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
          Verified Patient Profile
        </span>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile and medical history changes saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Personal & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Care Physician</label>
              <input
                type="text"
                value={physician}
                onChange={(e) => setPhysician(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Physical Attributes & Blood Profile
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Medical Condition Markers
          </h3>

          <div className="space-y-3 text-xs font-medium text-slate-800">
            <label className="flex items-center space-x-2.5 cursor-pointer p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={hypertension}
                onChange={(e) => setHypertension(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>History of Essential Hypertension (&gt;130/80 mmHg)</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={highCholesterol}
                onChange={(e) => setHighCholesterol(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>High Serum Cholesterol / Hyperlipidemia</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={familyDiabetes}
                onChange={(e) => setFamilyDiabetes(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>First-degree relative diagnosed with Type 2 Diabetes</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile & Medical History Changes</span>
        </button>
      </form>
    </div>
  );
};
