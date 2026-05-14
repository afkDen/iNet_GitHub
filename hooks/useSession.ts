import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Participant, Session } from '@/types';

export function useSession(sessionCode: string | null) {
    const [session, setSession] = useState<Session | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionCode) {
            setLoading(false);
            return;
        }

        async function fetchInitialData() {
            try {
                // 1. Fetch Session
                const { data: sessionData, error: sessionError } = await supabase
                    .from('sessions')
                    .select('*')
                    .eq('code', sessionCode)
                    .single();

                if (sessionError) throw sessionError;
                setSession(sessionData as Session);

                // 2. Fetch Participants
                const { data: participantData, error: participantError } = await supabase
                    .from('participants')
                    .select('*')
                    .eq('session_id', sessionData.id);

                if (participantError) throw participantError;
                setParticipants(participantData as Participant[]);
            } catch (err: any) {
                console.error('[useSession Error]:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchInitialData();

        // 3. Subscribe to Realtime Changes
        const channel = supabase
            .channel(`session:${sessionCode}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'participants',
                    // Note: session_id is a UUID, we need to match it correctly
                    // We'll filter in the payload for safety if direct filter is tricky
                },
                (payload) => {
                    if (!session) return;
                    
                    const newParticipant = payload.new as Participant;
                    const oldParticipant = payload.old as Participant;

                    if (payload.eventType === 'INSERT' && newParticipant.session_id === (session as any).id) {
                        setParticipants(prev => {
                            if (prev.find(p => p.id === newParticipant.id)) return prev;
                            return [...prev, newParticipant];
                        });
                    } else if (payload.eventType === 'UPDATE' && newParticipant.session_id === (session as any).id) {
                        setParticipants(prev => 
                            prev.map(p => p.id === newParticipant.id ? newParticipant : p)
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setParticipants(prev => prev.filter(p => p.id !== oldParticipant.id));
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'sessions',
                    filter: `code=eq.${sessionCode}`
                },
                (payload) => {
                    setSession(payload.new as Session);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sessionCode, session?.id]); // Re-run if ID is found to ensure filtering

    return { session, participants, loading, error };
}
