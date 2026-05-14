'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { Establishment, MatchResult } from '@/types';
import VibeBadge from '@/components/ui/VibeBadge';

export default function BarkadaRevealPage() {
    const params = useParams<{ code: string }>();
    const router = useRouter();
    const sessionCode = params?.code ?? '';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<{
        matches: MatchResult[];
        unanimous: boolean;
        top: MatchResult | null;
    } | null>(null);
    const [decidedMatch, setDecidedMatch] = useState<string | null>(null);
    const [decisionMessage, setDecisionMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionCode) {
            setError('No session code provided.');
            setLoading(false);
            return;
        }

        async function fetchResults() {
            try {
                const res = await fetch(`/api/match/${sessionCode}`);
                if (!res.ok) throw new Error('Could not fetch match results.');
                const data = await res.json();
                setResults(data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong.');
                setLoading(false);
            }
        }

        fetchResults();
    }, [sessionCode]);

    const handleAyaDecides = async () => {
        try {
            const res = await fetch(`/api/match/${sessionCode}/decide`);
            if (!res.ok) throw new Error('Aya could not decide.');
            const data = await res.json();

            if (data.decision) {
                setDecidedMatch(data.decision.establishment.id);
                setDecisionMessage(data.message);
            }
        } catch (err) {
            console.error('Decide error:', err);
        }
    };

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
                <p className="text-lg font-semibold text-[#1A1A1A]">Kinu-compute ni Aya...</p>
            </div>
        );
    }

    if (error || !results) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 bg-[#F5F0E8]">
                <p className="text-lg font-semibold text-[#1A1A1A] text-center">{error || 'No results found'}</p>
                <button
                    onClick={() => router.push('/onboarding')}
                    className="px-6 py-2.5 rounded-full bg-[#E8622A] text-white text-sm font-semibold"
                >
                    Subukan Ulit
                </button>
            </div>
        );
    }

    const { matches, unanimous, top } = results;

    if (matches.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 bg-[#F5F0E8]">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
                <h1 className="text-xl font-bold text-[#1A1A1A] text-center">Walang nag-agree...</h1>
                <p className="text-sm text-[#6B6B6B] text-center">Masyadong mapili ang barkada! Try again?</p>
                <button
                    onClick={() => router.push('/onboarding')}
                    className="mt-2 px-6 py-2.5 rounded-full bg-[#E8622A] text-white text-sm font-semibold"
                >
                    Mag-swipe Ulit
                </button>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.3 }
        }
    } as const;

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } }
    } as const;

    return (
        <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center px-4 py-8 max-w-[430px] mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <div className="inline-block px-4 py-1 rounded-full bg-[#E8622A] text-white text-xs font-bold uppercase tracking-widest mb-3">
                    {unanimous ? 'Everyone Agreed!' : 'Aya\'s Top Picks'}
                </div>
                <h1 className="text-3xl font-bold text-[#1A1A1A]">
                    {unanimous ? 'Perfect Match!' : 'Heto na ang results!'}
                </h1>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="w-full flex flex-col gap-6"
            >
                {/* Top Match Hero Card */}
                {top && (
                    <motion.div
                        variants={itemVariants}
                        className={`relative w-full rounded-[24px] bg-white overflow-hidden shadow-xl border-4 transition-colors duration-500 ${decidedMatch === top.establishment.id ? 'border-[#E8622A]' : 'border-transparent'}`}
                    >
                        <div className="relative w-full aspect-[4/3] bg-[#E8E3DA]">
                            <Image
                                src={top.establishment.photo_url}
                                alt={top.establishment.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#E8622A] shadow-sm">
                                TOP PICK
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-bold text-[#1A1A1A]">{top.establishment.name}</h2>
                                <span className="text-xs font-mono bg-[#FDF0EA] text-[#E8622A] px-2 py-1 rounded">
                                    {top.right_swipe_count} votes
                                </span>
                            </div>
                            <p className="text-sm text-[#6B6B6B] mb-4">
                                {top.establishment.category}
                            </p>

                            {/* Enthusiasm Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-[#6B6B6B]">Group Enthusiasm</span>
                                    <span className="text-[#E8622A]">{Math.round((top.right_swipe_count / (matches.length > 0 ? matches[0].right_swipe_count : 1)) * 100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-[#F0EDE8] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(top.right_swipe_count / (matches.length > 0 ? matches[0].right_swipe_count : 1)) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.8 }}
                                        className="h-full bg-[#E8622A]"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Other Matches */}
                <div className="space-y-3">
                    {matches.slice(1).map((match, idx) => (
                        <motion.div
                            key={match.establishment.id}
                            variants={itemVariants}
                            className={`flex items-center gap-4 p-3 rounded-2xl bg-white border transition-all ${decidedMatch === match.establishment.id ? 'border-[#E8622A] shadow-md' : 'border-[#E8E5DF]'}`}
                        >
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#E8E3DA] flex-shrink-0">
                                <Image src={match.establishment.photo_url} alt={match.establishment.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-[#1A1A1A] truncate">{match.establishment.name}</h3>
                                <p className="text-xs text-[#6B6B6B] truncate">{match.establishment.category}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-[#E8622A]">{match.right_swipe_count} votes</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Aya Decides Section */}
            <div className="mt-10 w-full text-center space-y-4">
                {!decidedMatch && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAyaDecides}
                        className="w-full py-4 rounded-2xl bg-[#1A1A1A] text-white font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Aya Decides — lock it in ☆
                    </motion.button>
                )}

                <AnimatePresence>
                    {decidedMatch && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-[#FDF0EA] border border-[#E8622A] text-center"
                        >
                            <p className="text-sm font-medium text-[#E8622A]">
                                {decisionMessage}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => router.push('/onboarding')}
                    className="text-sm font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                >
                    Start New Session
                </button>
            </div>
        </div>
    );
}
