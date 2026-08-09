/**
 * AI HealthGuard - Top Header Navigation Component
 */

import React, { useState, useEffect } from 'react';
import { Shield, Bell, User as UserIcon, LogOut, Check, Smartphone, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from '../../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: id }),
    }).catch(() => {});
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'predict', label: 'Diabetes Test' },
    { id: 'ai-assistant', label: 'AI Assistant' },
    { id: 'diet-exercise', label: 'Diet & Fitness' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'history', label: 'History' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">AI HealthGuard</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                AI Pro
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">Medical Shield Heartbeat</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/60">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowUserMenu(false);
              }}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-emerald-100 p-4 z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" /> Health Notifications
                  </h4>
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No recent notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkRead(notif.id)}
                        className={`p-3 rounded-2xl text-xs transition-colors cursor-pointer border ${
                          notif.read ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-emerald-50/70 border-emerald-200/80 text-slate-800 font-medium'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-semibold text-slate-900">{notif.title}</span>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1"></span>
                          )}
                        </div>
                        <p className="mt-1 leading-relaxed text-slate-600">{notif.message}</p>
                        <span className="mt-1.5 text-[10px] text-slate-400 block">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifDropdown(false);
              }}
              className="flex items-center space-x-2.5 p-1.5 rounded-2xl bg-slate-100 hover:bg-emerald-50 transition-colors border border-slate-200/50"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                {user?.fullName ? user.fullName.charAt(0) : 'S'}
              </div>
              <span className="text-xs font-semibold text-slate-800 hidden sm:inline-block max-w-[100px] truncate">
                {user?.fullName || 'Sarah'}
              </span>
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-xl border border-emerald-100 p-2 z-50">
                <div className="p-3 border-b border-slate-100 mb-1">
                  <p className="font-bold text-slate-900 text-xs">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                      {user?.role || 'Patient'}
                    </span>
                    <span className="text-[10px] text-slate-400">BMI: 27.2</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl font-medium flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5" /> Medical Profile
                </button>


                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl font-medium flex items-center gap-2"
                >
                  <Cpu className="w-3.5 h-3.5" /> ML Benchmarks
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-medium flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
