/**
 * AI HealthGuard - Auth Context Provider
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr_demo_101',
    fullName: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    age: 42,
    gender: 'Female',
    weight: 74,
    height: 165,
    phone: '+1 (555) 234-5678',
    role: 'Patient',
    medicalHistory: ['Gestational Diabetes in 2018', 'Mild Hypertension'],
    emergencyContact: {
      name: 'David Jenkins',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543',
    },
    createdAt: new Date().toISOString(),
  });

  const [token, setToken] = useState<string | null>(localStorage.getItem('healthguard_token') || 'demo_jwt_token');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch initial user profile from server
    fetch('/api/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.log('Auth check error, using demo fallback:', err));
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('healthguard_token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('healthguard_token');
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
