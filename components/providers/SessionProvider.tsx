'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionContext as ContextType, SessionMode } from '@/types';

interface SessionState {
  context: ContextType;
  setContext: (context: Partial<ContextType>) => void;
  resetSession: () => void;
}

const DEFAULT_CONTEXT: ContextType = {
  mode: 'solo',
  outing_type: 'food',
  group_size: 1,
  budget: 'mid',
  distance_km: 5,
  time_of_day: 'anytime',
};

const SessionContext = createContext<SessionState | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [context, setContextState] = useState<ContextType>(DEFAULT_CONTEXT);

  // Load from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('aya_session_context');
    if (saved) {
      try {
        setContextState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved context', e);
      }
    }
  }, []);

  const setContext = (updates: Partial<ContextType>) => {
    setContextState(prev => {
      const next = { ...prev, ...updates };
      sessionStorage.setItem('aya_session_context', JSON.stringify(next));
      return next;
    });
  };

  const resetSession = () => {
    setContextState(DEFAULT_CONTEXT);
    sessionStorage.removeItem('aya_session_context');
  };

  return (
    <SessionContext.Provider value={{ context, setContext, resetSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
