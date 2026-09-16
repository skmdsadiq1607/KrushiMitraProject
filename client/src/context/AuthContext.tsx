import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  loginDemoUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('crop_health_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await authApi.getMe();
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (error) {
        console.warn('Auth token verification skipped or failed. Using cached profile.');
        const cached = localStorage.getItem('crop_health_user');
        if (cached) {
          setUser(JSON.parse(cached));
        } else {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('crop_health_token', receivedToken);
      localStorage.setItem('crop_health_user', JSON.stringify(receivedUser));
    }
  };

  const register = async (data: { name: string; email: string; password: string; role?: string }) => {
    const response = await authApi.register(data);
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('crop_health_token', receivedToken);
      localStorage.setItem('crop_health_user', JSON.stringify(receivedUser));
    }
  };

  const loginDemoUser = async () => {
    await login('farmer@krushimitra.org', 'farmerpassword123');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('crop_health_token');
    localStorage.removeItem('crop_health_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginDemoUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
