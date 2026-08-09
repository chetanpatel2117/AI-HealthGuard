/**
 * AI HealthGuard - Main Application Controller Component
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';

import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { PredictionPage } from './pages/PredictionPage';
import { ResultPage } from './pages/ResultPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { DietPlannerPage } from './pages/DietPlannerPage';
import { OCRUploadPage } from './pages/OCRUploadPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AndroidGuidePage } from './pages/AndroidGuidePage';
import { PredictionResult, LabReportExtracted } from './types';

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeResult, setActiveResult] = useState<PredictionResult | null>(null);
  const [prefillData, setPrefillData] = useState<any>(null);
  const [initialAiPrompt, setInitialAiPrompt] = useState<string>('');

  if (!user) {
    return <AuthPage />;
  }

  const handleNavigate = (page: string, data?: any) => {
    if (page === 'result' && data) {
      setActiveResult(data);
    }
    setActiveTab(page);
  };

  const handlePredictSuccess = (result: PredictionResult) => {
    setActiveResult(result);
    setActiveTab('result');
  };

  const handleAutoFillFromOCR = (extracted: LabReportExtracted) => {
    setPrefillData({
      fullName: extracted.patientName || '',
      age: extracted.age || 0,
      glucose: extracted.glucose || 0,
      bloodPressure: extracted.bloodPressure || 0,
      insulin: extracted.insulin || 0,
      skinThickness: extracted.skinThickness || 0,
      bmi: extracted.bmi || 0,
    });
    setActiveTab('predict');
  };

  const handleNavigateToChat = (prompt?: string) => {
    if (prompt) setInitialAiPrompt(prompt);
    setActiveTab('ai-assistant');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Center Page Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
          {activeTab === 'predict' && (
            <PredictionPage
              onPredictSuccess={handlePredictSuccess}
              onNavigateToOCR={() => setActiveTab('ocr')}
              prefillData={prefillData}
            />
          )}
          {activeTab === 'result' && activeResult && (
            <ResultPage
              result={activeResult}
              onBack={() => setActiveTab('predict')}
              onNavigateToChat={handleNavigateToChat}
            />
          )}
          {activeTab === 'ai-assistant' && <AIAssistantPage initialPrompt={initialAiPrompt} />}
          {activeTab === 'diet-exercise' && <DietPlannerPage />}
          {activeTab === 'ocr' && <OCRUploadPage onAutoFillPrediction={handleAutoFillFromOCR} />}
          {activeTab === 'history' && (
            <HistoryPage
              onViewResult={(res) => {
                setActiveResult(res);
                setActiveTab('result');
              }}
            />
          )}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'profile' && <ProfilePage />}
          {activeTab === 'android-guide' && <AndroidGuidePage />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
