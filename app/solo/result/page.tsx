'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Establishment, MatchResult } from '@/types';
import VibeBadge from '@/components/ui/VibeBadge';

function SoloResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionCode = searchParams.get('session') ?? '';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [topMatch, setTopMatch] = useState<MatchResult | null>(null);

    useEffect(() => {
        if (!sessionCode) {
            setError('No session code provided.');
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function fetchResult() {
            try {
                const res = await fetch(`/api/match/${sessionCode}`);
                if (!res.ok) {
                    throw new Error('Could not fetch match results.');
                }
                const data = await res.json();

                if (cancelled) return;

                const match: MatchResult | null = data.top ?? null;
                setTopMatch(match);

                // Save to localStorage history
                if (match) {
                    try {
                        const raw = localStorage.getItem('aya_history');
                        const history = raw ? JSON.parse(raw) : [];
                        history.unshift({
                            date: new Date().toISOString(),
                            mode: 'solo',
                            matchedVenueName: match.establishment.name,
                            matchedVenueCategory: match.establishment.category,
                            participantCount: 1,
                        });
                        // Keep last 20 sessions
                        localStorage.setItem('aya_history', JSON.stringify(history.slice(0, 20)));
                    } catch {
                        // localStorage may be unavailable
                    }
                }

                setLoading(false);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Something went wrong.');
                    setLoading(false);
                }
            }
        }

        fetchResult();
        return () => { cancelled = true; };
    }, [sessionCode]);

    const handleOpenMaps = (est: Establishment) => {
        const query = encodeURIComponent(`${est.name} ${est.address ?? ''} ${est.city ?? ''}`);
        window.open(`https://maps.google.com/?q=${query}`, '_blank');
    };

    // Loading state
    if (loading) {
        return (
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
                <p className="text-lg font-semibold text-[#1A1A1A]">Kinukuha ang resulta...</p>
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

    // No match found
    if (!topMatch) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 bg-[#F5F0E8]">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
                <h1 className="text-xl font-bold text-[#1A1A1A] text-center">
                    Wala pang match...
                </h1>
                <p className="text-sm text-[#6B6B6B] text-center">
                    Subukan ulit? Baka may mas swak para sa iyo.
                </p>
                <button
                    type="button"
                    onClick={() => router.push('/onboarding')}
                    className="mt-2 px-6 py-2.5 rounded-full bg-[#E8622A] text-white text-sm font-semibold hover:bg-[#D4551E] active:scale-95 transition-transform"
                >
                    Mag-swipe Ulit
                </button>
            </div>
        );
    }

    const est = topMatch.establishment;

    return (
        <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center px-4 py-8">
            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-center mb-6"
            >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#E8622A" className="mx-auto mb-2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <h1 className="text-2xl font-bold text-[#1A1A1A]">Labas Na!</h1>
                <p className="text-sm text-[#6B6B6B] mt-1">
                    Aya found your top pick based on your swipes.
                </p>
            </motion.div>

            {/* Match card */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 18, delay: 0.2 }}
                className="w-full max-w-[360px] rounded-[20px] bg-white overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
                {/* Photo */}
                <div className="relative w-full aspect-[4/3] bg-[#E8E3DA]">
                    {est.photo_url ? (
                        <Image
                            src={est.photo_url}
                            alt={est.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 90vw, 360px"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                <line x1="6" y1="1" x2="6" y2="4" />
                                <line x1="10" y1="1" x2="10" y2="4" />
                                <line x1="14" y1="1" x2="14" y2="4" />
                            </svg>
                        </div>
                    )}

                    {/* Enthusiasm badge */}
                    <div className="absolute top-3 right-3 rounded-full px-3 py-1 bg-[#E8622A] text-white text-xs font-bold shadow-md">
                        {Math.round(topMatch.enthusiasm_score * 100)}% match
                    </div>
                </div>

                {/* Info */}
                <div className="px-4 pt-4 pb-5">
                    <p className="text-xs uppercase tracking-wider text-[#9E9E9E] font-medium mb-1">
                        {est.category}{est.city ? ` · ${est.city}` : ''}
                    </p>
                    <h2 className="text-xl font-bold text-[#1A1A1A] leading-tight mb-2">
                        {est.name}
                    </h2>

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-3">
                        <span className="inline-flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {est.address ?? est.city}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-3">
                        <span>
                            ~₱{est.cost_min}{est.cost_max > est.cost_min ? `–${est.cost_max}` : ''}/head
                        </span>
                        <span>·</span>
                        <span className={est.is_open ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                            {est.is_open ? 'Open now' : 'Closed'}
                        </span>
                    </div>

                    {/* Vibe tags */}
                    {est.vibe_tags && est.vibe_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {est.vibe_tags.slice(0, 4).map((tag) => (
                                <VibeBadge key={tag} tag={tag} variant="default" />
                            ))}
                        </div>
                    )}

                    {/* Enthusiasm bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-[#6B6B6B] mb-1">
                            <span>Enthusiasm</span>
                            <span>{Math.round(topMatch.enthusiasm_score * 100)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-[#E8622A] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.round(topMatch.enthusiasm_score * 100)}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="w-full max-w-[360px] flex flex-col gap-3 mt-6"
            >
                <button
                    type="button"
                    onClick={() => handleOpenMaps(est)}
                    className="w-full py-3 rounded-full bg-[#E8622A] text-white font-semibold text-sm hover:bg-[#D4551E] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    Buksan sa Maps
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/onboarding')}
                    className="w-full py-3 rounded-full border-2 border-[#E8E5DF] text-[#6B6B6B] font-semibold text-sm hover:bg-white active:scale-[0.98] transition-transform"
                >
                    Mag-swipe Ulit
                </button>
            </motion.div>
        </div>
    );
}

export default function SoloResultPage() {
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
                <p className="text-lg font-semibold text-[#1A1A1A]">Kinukuha ang results...</p>
            </div>
        }>
            <SoloResultContent />
        </Suspense>
    );
}
