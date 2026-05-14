'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useSession, type UseSessionReturn } from '@/hooks/useSession';

const SessionContext = createContext<UseSessionReturn | null>(null);

export interface SessionProviderProps {
    sessionCode: string | null;
    participantId: string | null;
    children: ReactNode;
}

export function SessionProvider({
    sessionCode,
    participantId,
    children,
}: SessionProviderProps) {
    const sessionState = useSession(sessionCode, participantId);

    return (
        <SessionContext.Provider value={sessionState}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionContext(): UseSessionReturn {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error(
            'useSessionContext must be used within a SessionProvider'
        );
    }
    return context;
}
