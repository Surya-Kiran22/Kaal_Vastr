import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const LOCAL_ADMIN_KEY = 'kaalvastr_admin_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_ADMIN_KEY) === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(Boolean(session?.user));
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(Boolean(session?.user));
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local demo mode setup
      const localSession = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (localSession === 'true') {
        setIsAdmin(true);
      }
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.session) {
          setSession(data.session);
          setUser(data.user);
          setIsAdmin(true);
          localStorage.setItem(LOCAL_ADMIN_KEY, 'true');
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Login failed' };
      }
    }

    // Default admin credentials for standalone demo / offline testing
    if ((email === 'admin@kaalvastr.in' || email === 'admin') && (pass === 'kaalvastr123' || pass === 'admin123')) {
      setIsAdmin(true);
      localStorage.setItem(LOCAL_ADMIN_KEY, 'true');
      return { success: true };
    }

    return { success: false, error: 'Invalid admin email or password' };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    localStorage.removeItem(LOCAL_ADMIN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, loginWithEmail, logout }}>
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
