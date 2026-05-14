'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Establishment, SessionContext } from '@/types';
import SwipeDeck from '@/components/ui/SwipeDeck';

function SoloPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionCode = searchParams.get('session') ?? '';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);
    const [sessionId, setSessionId] = useState('');
    const [participantId, setParticipantId] = useState('');

    useEffect(() => {
        if (!sessionCode) {
            setError('No session code provided. Please start from the beginning.');
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function init() {
            try {
                // 1. Fetch session + card stack
                const sessionRes = await fetch(`/api/session/${sessionCode}`);
                if (!sessionRes.ok) {
                    throw new Error('Session not found or expired.');
                }
                const sessionData = await sessionRes.json();

                if (cancelled) return;

                const session = sessionData.session;
                const cardStack: Establishment[] = sessionData.cardStack ?? [];

                if (cardStack.length === 0) {
                    throw new Error('No cards in this session. Try creating a new one.');
                }

                setEstablishments(cardStack);
                setSessionId(session.id);

                // Build SessionContext from session filters
                const filters = session.filters ?? {};
                setSessionContext({
                    mode: session.mode ?? 'solo',
                    outing_type: filters.outingType ?? 'food',
                    group_size: filters.groupSize === 'solo' ? 1 : filters.groupSize === 'small' ? 2 : filters.groupSize === 'medium' ? 4 : 8,
                    budget: filters.budget ?? 'mid',
                    distance_km: filters.maxDistanceKm ?? 3,
                    time_of_day: filters.timeContext ?? 'anytime',
                    natural_language: filters.nlpInput ?? undefined,
                });

                // 2. Join session (create participant)
                const storedParticipantId = sessionStorage.getItem('aya_participant_id');
                if (storedParticipantId) {
                    setParticipantId(storedParticipantId);
                } else {
                    const joinRes = await fetch(`/api/session/${sessionCode}/join`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nickname: 'Solo Swiper' }),
                    });
                    if (joinRes.ok) {
                        const joinData = await joinRes.json();
                        if (!cancelled) {
                            const pid = joinData.participant?.id ?? '';
                            setParticipantId(pid);
                            sessionStorage.setItem('aya_participant_id', pid);
                        }
                    }
                    // Non-blocking: even if join fails, we can still swipe
                }

                setLoading(false);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Something went wrong.');
                    setLoading(false);
                }
            }
        }

        init();
        return () => { cancelled = true; };
    }, [sessionCode]);

    const handleComplete = useCallback(() => {
        router.push(`/solo/result?session=${sessionCode}`);
    }, [router, sessionCode]);

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 bg-[#F5F0E8]">
                {/* Aya flame spinner */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E8622A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2c-1.5 4-2 6-2 8 0 3.5 2 5 2 5s2-1.5 2-5c0-2-.5-4-2-8z" />
                        <path d="M12 2c1.5 4 2 6 2 8 0 3.5-2 5-2 5s-2-1.5-2-5c0-2 .5-4 2-8z" opacity="0.4" />
                    </svg>
                </motion.div>
                <p className="text-lg font-semibold text-[#1A1A1A]">Hinahanap ni Aya...</p>
                <p className="text-sm text-[#6B6B6B]">Sandali lang, naghahanda ng mga pagpipilian.</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 bg-[#F5F0E8]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-lg font-semibold text-[#1A1A1A] text-center">{error}</p>
                <button
                    type="button"
                    onClick={() => router.push('/onboarding')}
                    className="mt-2 px-6 py-2.5 rounded-full bg-[#E8622A] text-white text-sm font-semibold hover:bg-[#D4551E] active:scale-95 transition-transform"
                >
                    Subukan Ulit
                </button>
            </div>
        );
    }

    // No session context yet
    if (!sessionContext) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-4 pt-4 pb-2">
                <button
                    type="button"
                    onClick={() => router.push('/onboarding')}
                    className="text-[#1A1A1A] hover:text-[#E8622A] transition-colors"
                    aria-label="Back"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">aya</span>
                <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-[#FDF0EA] text-[#E8622A]">
                    SOLO
                </span>
            </header>

            {/* Swipe Deck */}
            <main className="flex-1 flex flex-col items-center justify-center px-2">
                <SwipeDeck
                    establishments={establishments}
                    context={sessionContext}
                    sessionId={sessionId}
                    participantId={participantId}
                    onComplete={handleComplete}
                />
            </main>
        </div>
    );
}

export default function SoloPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 bg-[#F5F0E8]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E8622A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2c-1.5 4-2 6-2 8 0 3.5 2 5 2 5s2-1.5 2-5c0-2-.5-4-2-8z" />
                        <path d="M12 2c1.5 4 2 6 2 8 0 3.5-2 5-2 5s-2-1.5-2-5c0-2 .5-4 2-8z" opacity="0.4" />
                    </svg>
                </motion.div>
                <p className="text-lg font-semibold text-[#1A1A1A]">Hinahanap ni Aya...</p>
            </div>
        }>
            <SoloPageContent />
        </Suspense>
    );
}
