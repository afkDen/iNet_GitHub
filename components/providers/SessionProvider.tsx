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

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedContext = sessionStorage.getItem('aya_session_context');
    const savedSession = sessionStorage.getItem('aya_session_data');
    const savedParticipant = sessionStorage.getItem('aya_participant_data');

    if (savedContext) {
      try { setContextState(JSON.parse(savedContext)); } catch (e) { console.error('Failed to parse saved context', e); }
    }
    if (savedSession) {
      try { setSessionDataState(JSON.parse(savedSession)); } catch (e) { console.error('Failed to parse saved session', e); }
    }
    if (savedParticipant) {
      try { setParticipantState(JSON.parse(savedParticipant)); } catch (e) { console.error('Failed to parse saved participant', e); }
    }
  }, []);

  const setContext = (updates: Partial<ContextType>) => {
    setContextState(prev => {
      const next = { ...prev, ...updates };
      sessionStorage.setItem('aya_session_context', JSON.stringify(next));
      return next;
    });
  };

  const setSessionData = (data: Session | null) => {
    setSessionDataState(data);
    if (data) {
      sessionStorage.setItem('aya_session_data', JSON.stringify(data));
    } else {
      sessionStorage.removeItem('aya_session_data');
    }
  };

  const setParticipant = (data: Participant | null) => {
    setParticipantState(data);
    if (data) {
      sessionStorage.setItem('aya_participant_data', JSON.stringify(data));
    } else {
      sessionStorage.removeItem('aya_participant_data');
    }
  };

  const resetSession = () => {
    setContextState(DEFAULT_CONTEXT);
    setSessionDataState(null);
    setParticipantState(null);
    sessionStorage.removeItem('aya_session_context');
    sessionStorage.removeItem('aya_session_data');
    sessionStorage.removeItem('aya_participant_data');
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
