/**
 * AI HealthGuard - Gemini AI Chat Assistant Page with Voice Input/Output
 */

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Mic, MicOff, Volume2, VolumeX, Download, Sparkles, User, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { apiFetch } from '../lib/api';

interface AIAssistantPageProps {
  initialPrompt?: string;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial chat history from backend
    apiFetch('/api/gemini/chat/history')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data);
        } else {
          setMessages([
            {
              id: 'init_1',
              sender: 'ai',
              text: 'Hello! I am your AI HealthGuard Medical Assistant powered by Google Gemini. How can I assist you today with your glycemic health, diabetes risk, or diet?',
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        throw new Error('No message response');
      }
    } catch (e) {
      // Fallback AI reply
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `Based on medical guidelines regarding "${messageText}":\n• Fasting blood glucose target: 70 - 99 mg/dL.\n• Prioritize low-glycemic foods (leafy greens, chia seeds, salmon, oats).\n• Engage in 150 minutes of aerobic exercise weekly to maintain muscle insulin sensitivity.\n• Consult your primary care physician for personalized clinical evaluation.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Voice Speech-To-Text Recognition
  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    }
  };

  // Voice Text-To-Speech Output
  const handleReadAloud = (msg: ChatMessage) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg.text);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);
      setSpeakingMsgId(msg.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Export Chat History
  const handleExportChat = () => {
    const transcript = messages
      .map((m) => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HealthGuard_Chat_Transcript_${Date.now()}.txt`;
    a.click();
  };

  const suggestedPrompts = [
    'How can I lower my fasting glucose naturally?',
    'What foods should I avoid with prediabetes?',
    'Create a 7-day low-glycemic meal plan',
    'What exercises improve insulin sensitivity best?',
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl border border-emerald-100 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-emerald-100 bg-emerald-50/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Bot className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              AI HealthGuard Assistant <Sparkles className="w-4 h-4 text-emerald-600" />
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Powered by Google Gemini AI Engine</p>
          </div>
        </div>

        <button
          onClick={handleExportChat}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center space-x-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Chat</span>
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Suggested:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[11px] font-semibold border border-slate-200 shrink-0 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 text-xs font-bold ${
                  isUser ? 'bg-slate-800' : 'bg-emerald-600 shadow-sm shadow-emerald-600/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] sm:max-w-[75%] space-y-1`}>
                <div
                  className={`p-4 rounded-3xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-emerald-50/80 text-slate-900 border border-emerald-100 rounded-tl-none font-medium'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                <div className={`flex items-center space-x-2 text-[10px] text-slate-400 ${isUser ? 'justify-end' : ''}`}>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleReadAloud(msg)}
                      className={`hover:text-emerald-700 ${speakingMsgId === msg.id ? 'text-amber-500 font-bold' : ''}`}
                    >
                      {speakingMsgId === msg.id ? 'Stop Speech' : 'Listen'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold italic p-2">
            <Bot className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span>Gemini AI is generating medical advice...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          {/* Voice Microphone Input */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-2xl transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
            }`}
            title={isRecording ? 'Listening...' : 'Voice Speech-to-Text Input'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? 'Listening to your voice...' : 'Ask AI HealthGuard anything...'}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
