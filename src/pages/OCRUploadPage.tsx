/**
 * AI HealthGuard - Blood Lab Report OCR Scanner Page
 */

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Sparkles, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { LabReportExtracted } from '../types';

interface OCRUploadPageProps {
  onAutoFillPrediction: (extracted: LabReportExtracted) => void;
}

export const OCRUploadPage: React.FC<OCRUploadPageProps> = ({ onAutoFillPrediction }) => {
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<LabReportExtracted | null>(null);
  const [error, setError] = useState('');

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Str = (reader.result as string).split(',')[1];
        const mimeType = file.type || 'image/png';

        const res = await fetch('/api/ocr/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Image: base64Str, mimeType }),
        });

        if (!res.ok) throw new Error('OCR Parsing failed');
        const data = await res.json();
        setExtractedData(data);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError('Failed to scan report. Please try again with a clearer image or PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-12">
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6 stroke-[2.2]" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Lab Report Vision OCR Scanner</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Upload blood test report photos or PDFs to automatically extract fasting glucose, HbA1c, blood pressure, and insulin metrics using Gemini Vision AI.
        </p>

      </div>

      {/* Drag & Drop Upload Zone */}
      {!extractedData && (
        <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-emerald-200 hover:border-emerald-400 transition-colors text-center relative cursor-pointer">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100/60 text-emerald-700 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-xs">
                Click or drag & drop blood test report image/PDF
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, WEBP, PDF up to 10MB</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="p-8 bg-white rounded-3xl border border-emerald-100 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="font-bold text-slate-900 text-sm">Gemini Multimodal Vision OCR is analyzing lab report...</p>
          <p className="text-xs text-slate-400">Extracting fasting glucose, blood pressure, insulin, & patient details...</p>
        </div>
      )}

      {/* Extracted Lab Values Display */}
      {extractedData && !loading && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Extraction Confidence: {extractedData.confidenceScore}%
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-1">Extracted Blood Lab Report Metrics</h3>
            </div>
            <button
              onClick={() => setExtractedData(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Scan Another
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Patient Name</span>
              <strong className="text-xs text-slate-900">{extractedData.patientName}</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Fasting Glucose</span>
              <strong className="text-sm text-emerald-800 font-extrabold">{extractedData.glucose} mg/dL</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">HbA1c Level</span>
              <strong className="text-sm text-amber-800 font-extrabold">{extractedData.hba1c}%</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Blood Pressure</span>
              <strong className="text-xs text-slate-900">{extractedData.bloodPressure} mmHg</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Insulin</span>
              <strong className="text-xs text-slate-900">{extractedData.insulin} µU/ml</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Skin Thickness</span>
              <strong className="text-xs text-slate-900">{extractedData.skinThickness} mm</strong>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-1">
            <p className="font-bold text-slate-800 mb-1">OCR Analysis Notes:</p>
            {extractedData.notes.map((note, i) => (
              <p key={i} className="text-slate-600 text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{note}</span>
              </p>
            ))}
          </div>

          <button
            onClick={() => onAutoFillPrediction(extractedData)}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>Auto-Fill Diabetes Test Form with Scanned Metrics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
