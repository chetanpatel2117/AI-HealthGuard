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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('healthguard_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = token || localStorage.getItem('healthguard_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setToken(savedToken);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('healthguard_token');
        }
      } catch (err) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('healthguard_token');
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
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
    setUser((currentUser) => (currentUser ? { ...currentUser, ...updated } : null));
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
