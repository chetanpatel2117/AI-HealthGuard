/**
 * AI HealthGuard - History Records Page
 */

import React, { useState, useEffect } from 'react';
import { History, Search, Download, Trash2, Eye, FileSpreadsheet, ArrowUpDown } from 'lucide-react';
import { PredictionResult } from '../types';
import * as XLSX from 'xlsx';

interface HistoryPageProps {
  onViewResult: (result: PredictionResult) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onViewResult }) => {
  const [records, setRecords] = useState<PredictionResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('All');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (Array.isArray(data)) setRecords(data);
    } catch (e) {
      console.error('Failed to fetch history:', e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error('Failed to delete record:', e);
    }
  };

  const handleExportAll = () => {
    const exportData = records.map((r) => ({
      ID: r.id,
      Date: new Date(r.timestamp).toLocaleString(),
      PatientName: r.patientName,
      Age: r.age,
      Gender: r.inputData.gender,
      Glucose: r.glucose,
      BloodPressure: r.bloodPressure,
      BMI: r.bmi,
      Insulin: r.insulin,
      Pedigree: r.diabetesPedigree,
      Probability: `${r.probability}%`,
      RiskLevel: r.riskLevel,
      HealthScore: r.healthScore,
      Model: r.selectedModel,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All_Predictions');
    XLSX.writeFile(wb, `HealthGuard_All_Records_${Date.now()}.xlsx`);
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || r.riskLevel.toLowerCase().includes(riskFilter.toLowerCase());
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" /> Patient Prediction History & Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Persisted SQLite / JSON health records database. Search, filter, inspect SHAP, and export reports.
          </p>
        </div>

        <button
          onClick={handleExportAll}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2 shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export All Records (Excel)</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name or ID..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Low Risk', 'Moderate Risk', 'High Risk', 'Severe Risk'].map((level) => (
            <button
              key={level}
              onClick={() => setRiskFilter(level)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                riskFilter === level ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Patient</th>
                <th className="pb-3">Glucose</th>
                <th className="pb-3">BMI</th>
                <th className="pb-3">Risk Level</th>
                <th className="pb-3">ML Model</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                    No prediction records found matching your query.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-slate-500">
                      {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3 font-bold text-slate-900">{item.patientName}</td>
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
                    <td className="py-3 text-slate-500 truncate max-w-[150px]">{item.selectedModel}</td>
                    <td className="py-3 text-right space-x-1">
                      <button
                        onClick={() => onViewResult(item)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors inline-flex items-center"
                        title="View Full Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors inline-flex items-center"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
