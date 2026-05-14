import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Session, Participant } from '@/types';

export interface UseSessionReturn {
    session: Session | null;
    participants: Participant[];
    allDone: boolean;
    loading: boolean;
    error: string | null;
}

export function useSession(
    sessionCode: string | null,
    participantId: string | null
): UseSessionReturn {
    const [session, setSession] = useState<Session | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [allDone, setAllDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Track the current session ID for the Realtime filter
    const sessionIdRef = useRef<string | null>(null);
    // Track whether the component is still mounted
    const mountedRef = useRef(true);

    // Helper: check if all participants are done
    const checkAllDone = useCallback((participantList: Participant[]): boolean => {
        if (participantList.length === 0) return false;
        return participantList.every((p) => p.status === 'done');
    }, []);

    useEffect(() => {
        mountedRef.current = true;

        // Reset state when sessionCode changes
        if (!sessionCode) {
            setSession(null);
            setParticipants([]);
            setAllDone(false);
            setLoading(false);
            setError(null);
            sessionIdRef.current = null;
            return;
        }

        let channel: ReturnType<typeof supabase.channel> | null = null;

        const initializeSession = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1. Fetch initial session data from /api/session/[code]
                const sessionRes = await fetch(`/api/session/${sessionCode}`);
                if (!sessionRes.ok) {
                    throw new Error(
                        sessionRes.status === 404
                            ? 'Session not found'
                            : 'Failed to fetch session'
                    );
                }

                const sessionData = await sessionRes.json();
                const fetchedSession: Session = sessionData.session;

                if (!mountedRef.current) return;
                setSession(fetchedSession);
                sessionIdRef.current = fetchedSession.id;

                // 2. Fetch initial participants from Supabase
                const { data: initialParticipants, error: participantsError } =
                    await supabase
                        .from('participants')
                        .select('*')
                        .eq('session_id', fetchedSession.id)
                        .order('joined_at', { ascending: true });

                if (participantsError) {
                    console.error(
                        '[useSession] Failed to fetch participants:',
                        participantsError
                    );
                }

                if (!mountedRef.current) return;

                const participantList: Participant[] =
                    (initialParticipants as Participant[]) || [];
                setParticipants(participantList);
                setAllDone(checkAllDone(participantList));

                // 3. Set up Supabase Realtime channel
                const channelName = `session:${sessionCode}`;
                channel = supabase.channel(channelName);

                // Listen for postgres_changes on participants table
                channel.on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'participants',
                        filter: `session_id=eq.${fetchedSession.id}`,
                    },
                    (payload) => {
                        if (!mountedRef.current) return;

                        const changedParticipant = payload.new as Participant;
                        const oldParticipant = payload.old as Participant;

                        setParticipants((prev) => {
                            let updated: Participant[];

                            switch (payload.eventType) {
                                case 'INSERT':
                                    // Avoid duplicates
                                    if (
                                        prev.some(
                                            (p) =>
                                                p.id === changedParticipant.id
                                        )
                                    ) {
                                        return prev;
                                    }
                                    updated = [...prev, changedParticipant];
                                    break;

                                case 'UPDATE':
                                    updated = prev.map((p) =>
                                        p.id === changedParticipant.id
                                            ? changedParticipant
                                            : p
                                    );
                                    break;

                                case 'DELETE':
                                    updated = prev.filter(
                                        (p) => p.id !== oldParticipant?.id
                                    );
                                    break;

                                default:
                                    return prev;
                            }

                            // After updating participants, check allDone
                            setAllDone(checkAllDone(updated));
                            return updated;
                        });
                    }
                );

                // Subscribe to the channel
                const status = await channel.subscribe();
                console.log(
                    `[useSession] Subscribed to channel "${channelName}"`,
                    status
                );
            } catch (err) {
                if (!mountedRef.current) return;
                console.error('[useSession] Error:', err);
                setError(
                    err instanceof Error ? err.message : 'An error occurred'
                );
            } finally {
                if (mountedRef.current) {
                    setLoading(false);
                }
            }
        };

        initializeSession();

        // Cleanup: unsubscribe channel on unmount or sessionCode change
        return () => {
            mountedRef.current = false;
            if (channel) {
                console.log(
                    `[useSession] Unsubscribing from channel "session:${sessionCode}"`
                );
                supabase.removeChannel(channel);
            }
        };
    }, [sessionCode, participantId, checkAllDone]);

    return { session, participants, allDone, loading, error };
}
