/**
 * AI HealthGuard - Diabetes Prediction Result Page & SHAP Report
 */

import React from 'react';
import { PredictionResult } from '../types';
import { RiskGauge } from '../components/common/RiskGauge';
import { SHAPPlot } from '../components/common/SHAPPlot';
import { Shield, FileText, Download, Bot, ArrowLeft, CheckCircle2, AlertTriangle, Stethoscope, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
// Use CSV export instead of xlsx due to upstream vulnerabilities in the xlsx package

interface ResultPageProps {
  result: PredictionResult;
  onBack: () => void;
  onNavigateToChat: (initialMsg?: string) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ result, onBack, onNavigateToChat }) => {
  // PDF Export Handler
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setTextColor(5, 150, 105); // emerald green
      doc.text('AI HealthGuard - Clinical Medical Report', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated Date: ${new Date(result.timestamp).toLocaleString()}`, 14, 28);
      doc.text(`Report ID: ${result.id}`, 14, 34);

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Patient Demographics & Lab Metrics', 14, 46);

      doc.setFontSize(10);
      doc.text(`Patient Name: ${result.patientName}`, 14, 54);
      doc.text(`Age: ${result.age} yrs | Gender: ${result.inputData.gender}`, 14, 60);
      doc.text(`BMI: ${result.bmi} kg/m² (${result.bmiCategory})`, 14, 66);
      doc.text(`Fasting Glucose: ${result.glucose} mg/dL`, 14, 72);
      doc.text(`Blood Pressure: ${result.bloodPressure} mmHg`, 14, 78);
      doc.text(`Insulin: ${result.insulin} uU/ml | Pedigree: ${result.diabetesPedigree}`, 14, 84);

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('2. Machine Learning Prediction Results', 14, 96);

      doc.setFontSize(11);
      doc.text(`ML Model Engine: ${result.selectedModel}`, 14, 104);
      doc.text(`Predicted Diabetes Probability: ${result.probability}%`, 14, 110);
      doc.text(`Assigned Risk Level: ${result.riskLevel}`, 14, 116);
      doc.text(`Overall Health Score: ${result.healthScore}/100`, 14, 122);

      doc.setFontSize(12);
      doc.text('3. Doctor & Clinical Recommendations', 14, 134);
      let y = 142;
      result.doctorRecommendations.forEach((rec, i) => {
        doc.setFontSize(10);
        doc.text(`• ${rec}`, 16, y);
        y += 7;
      });

      doc.save(`HealthGuard_Diabetes_Report_${result.patientName.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Report exported successfully!');
    }
  };

  // CSV Export Handler
  const downloadCSV = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = r[h] ?? '';
            const s = String(v).replace(/"/g, '""');
            return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    try {
      const data = [
        { Parameter: 'Report ID', Value: result.id },
        { Parameter: 'Patient Name', Value: result.patientName },
        { Parameter: 'Age', Value: result.age },
        { Parameter: 'Glucose (mg/dL)', Value: result.glucose },
        { Parameter: 'Blood Pressure (mmHg)', Value: result.bloodPressure },
        { Parameter: 'BMI (kg/m²)', Value: result.bmi },
        { Parameter: 'Insulin (uU/ml)', Value: result.insulin },
        { Parameter: 'Diabetes Pedigree', Value: result.diabetesPedigree },
        { Parameter: 'Predicted Risk Probability', Value: `${result.probability}%` },
        { Parameter: 'Risk Level', Value: result.riskLevel },
        { Parameter: 'Health Score', Value: result.healthScore },
        { Parameter: 'ML Engine Model', Value: result.selectedModel },
      ];

      downloadCSV(`HealthGuard_Report_${result.patientName.replace(/\s+/g, '_')}.csv`, data);
    } catch (e) {
      console.error('CSV export error:', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Prediction</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateToChat(`Explain my diabetes risk score of ${result.probability}% (${result.riskLevel}) and give me a custom diet plan.`)}
            className="px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs flex items-center space-x-2"
          >
            <Bot className="w-4 h-4" />
            <span>Discuss with Gemini AI</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center space-x-1"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Prediction Score Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Arc Risk Gauge */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
          <RiskGauge probability={result.probability} healthScore={result.healthScore} riskLevel={result.riskLevel} />
          <p className="text-xs text-slate-400 font-medium mt-2 text-center">
            Evaluated by <strong className="text-slate-700">{result.selectedModel}</strong> ({result.modelAccuracy}% Dataset Accuracy)
          </p>
        </div>

        {/* Right Summary Insights */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Patient: {result.patientName} ({result.age} yrs, {result.inputData.gender})
            </span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {result.backendMetadata?.engine || 'Python 3.10 ML Engine'}
              {result.backendMetadata?.executionTimeMs && (
                <span className="text-slate-400 font-mono text-[10px]">({result.backendMetadata.executionTimeMs} ms)</span>
              )}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            AI Clinical Metabolic Diagnosis
          </h2>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs leading-relaxed text-slate-700 font-medium">
            <p className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{result.aiSummary}</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Glucose</span>
              <strong className="text-slate-900 text-sm">{result.glucose} mg/dL</strong>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">BMI</span>
              <strong className="text-slate-900 text-sm">{result.bmi} kg/m²</strong>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pedigree</span>
              <strong className="text-slate-900 text-sm">{result.diabetesPedigree}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* SHAP Explainable AI Section */}
      <SHAPPlot contributions={result.shapContributions} />

      {/* Doctor & Lifestyle Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clinical Doctor Recommendations */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-600" /> Primary Doctor Clinical Advice
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {result.doctorRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Personalized Lifestyle & Diet Instructions */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" /> Targeted Lifestyle & Glycemic Instructions
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {result.lifestyleAdvice.map((adv, i) => (
              <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-teal-50/50 border border-teal-100">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
