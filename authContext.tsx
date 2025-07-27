"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { handleLogIn, handleLogOut, handleSignUp, getCurrentUser } from './authentication';
import { IUser } from './models/user.model';

interface AuthContextType {
  isLoggedIn: boolean;
  user: IUser | null;
  login: (formData: FormData) => Promise<FormState>;
  logout: () => Promise<void>;
  signup: (formData: FormData) => Promise<FormState>;
  loading: boolean;
}

interface FormState {
  success: boolean;
  message: string;
  token?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData: FormData) => {
    try {
      setLoading(true);
      const result = await handleLogIn(null, formData);
      if (result.success) {
        await checkAuth(); // Refresh auth state
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData: FormData) => {
    try {
      setLoading(true);
      const result = await handleSignUp(null, formData);
      if (result.success) {
        await checkAuth(); // Refresh auth state
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await handleLogOut();
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      login, 
      logout, 
      signup,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};