'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionContext as ContextType, SessionMode, Session, Participant } from '@/types';

interface SessionState {
  context: ContextType;
  setContext: (context: Partial<ContextType>) => void;
  sessionData: Session | null;
  setSessionData: (session: Session | null) => void;
  participant: Participant | null;
  setParticipant: (participant: Participant | null) => void;
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
  const [sessionData, setSessionDataState] = useState<Session | null>(null);
  const [participant, setParticipantState] = useState<Participant | null>(null);

  const setContext = (updates: Partial<ContextType>) => {
    setContextState(prev => ({ ...prev, ...updates }));
  };

  const setSessionData = (data: Session | null) => {
    setSessionDataState(data);
  };

  const setParticipant = (data: Participant | null) => {
    setParticipantState(data);
  };

  const resetSession = () => {
    setContextState(DEFAULT_CONTEXT);
    setSessionDataState(null);
    setParticipantState(null);
  };

  return (
    <SessionContext.Provider value={{ 
      context, 
      setContext, 
      sessionData, 
      setSessionData, 
      participant, 
      setParticipant, 
      resetSession 
    }}>
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
