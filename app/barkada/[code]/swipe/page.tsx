'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Establishment, SessionContext } from '@/types';
import SwipeDeck from '@/components/ui/SwipeDeck';

export default function BarkadaSwipePage() {
    const params = useParams<{ code: string }>();
    const router = useRouter();
    const sessionCode = params?.code ?? '';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);
    const [sessionId, setSessionId] = useState('');
    const [participantId, setParticipantId] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!sessionCode) {
            setError('No session code provided.');
            setLoading(false);
            return;
        }

        // Read participantId from sessionStorage
        const storedParticipantId =
            typeof window !== 'undefined'
                ? sessionStorage.getItem('aya_participant_id')
                : null;

        if (!storedParticipantId) {
            setError('No participant found. Please join the session first.');
            setLoading(false);
            return;
        }

        setParticipantId(storedParticipantId);

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
                    throw new Error('No cards in this session.');
                }

                setEstablishments(cardStack);
                setSessionId(session.id);

                // Build SessionContext from session filters
                const filters = session.filters ?? {};
                setSessionContext({
                    mode: 'barkada',
                    outing_type: filters.outingType ?? 'food',
                    group_size:
                        filters.groupSize === 'solo'
                            ? 1
                            : filters.groupSize === 'small'
                                ? 2
                                : filters.groupSize === 'medium'
                                    ? 4
                                    : 8,
                    budget: filters.budget ?? 'mid',
                    distance_km: filters.maxDistanceKm ?? 5,
                    time_of_day: filters.timeContext ?? 'anytime',
                    natural_language: filters.nlpInput ?? undefined,
                });

                // 2. PATCH participant to 'swiping'
                await fetch(`/api/participants/${storedParticipantId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'swiping' }),
                });

                setLoading(false);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Something went wrong.'
                    );
                    setLoading(false);
                }
            }
        }

        init();
        return () => {
            cancelled = true;
        };
    }, [sessionCode]);

    const handleComplete = useCallback(() => {
        setIsComplete(true);
        // PATCH participant to 'done'
        if (participantId) {
            fetch(`/api/participants/${participantId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'done' }),
            }).catch((err) => console.error('Failed to mark done:', err));
        }
        // useSession in the layout will detect allDone and redirect to reveal
    }, [participantId]);

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 bg-[#F5F0E8]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'linear',
                    }}
                >
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#E8622A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 2c-1.5 4-2 6-2 8 0 3.5 2 5 2 5s2-1.5 2-5c0-2-.5-4-2-8z" />
                        <path
                            d="M12 2c1.5 4 2 6 2 8 0 3.5-2 5-2 5s-2-1.5-2-5c0-2 .5-4 2-8z"
                            opacity="0.4"
                        />
                    </svg>
                </motion.div>
                <p className="text-lg font-semibold text-[#1A1A1A]">
                    Hinahanap ni Aya...
                </p>
                <p className="text-sm text-[#6B6B6B]">
                    Sandali lang, naghahanda ng mga pagpipilian.
                </p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 bg-[#F5F0E8]">
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-lg font-semibold text-[#1A1A1A] text-center">
                    {error}
                </p>
                <button
                    type="button"
                    onClick={() => router.push(`/barkada/${sessionCode}/lobby`)}
                    className="mt-2 px-6 py-2.5 rounded-full bg-[#E8622A] text-white text-sm font-semibold hover:bg-[#D4551E] active:scale-95 transition-transform"
                >
                    Bumalik sa Lobby
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
                    onClick={() => router.push(`/barkada/${sessionCode}/lobby`)}
                    className="text-[#1A1A1A] hover:text-[#E8622A] transition-colors"
                    aria-label="Back to lobby"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">
                    aya
                </span>
                <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-[#FDF0EA] text-[#E8622A]">
                    BARKADA
                </span>
            </header>

            {/* Swipe Deck */}
            <main className="flex-1 flex flex-col items-center justify-center px-2 relative">
                <SwipeDeck
                    establishments={establishments}
                    context={sessionContext}
                    sessionId={sessionId}
                    sessionCode={sessionCode}
                    participantId={participantId}
                    onComplete={handleComplete}
                />

                {/* Waiting overlay when complete */}
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F0E8]/90 backdrop-blur-sm gap-4 px-6"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: 'linear',
                            }}
                        >
                            <svg
                                width="56"
                                height="56"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#E8622A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                            </svg>
                        </motion.div>
                        <h2 className="text-xl font-bold text-[#1A1A1A] text-center">
                            Naghihintay sa mga kasama...
                        </h2>
                        <p className="text-sm text-[#6B6B6B] text-center">
                            Results will appear automatically once everyone
                            finishes swiping.
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
