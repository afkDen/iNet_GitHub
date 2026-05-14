'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BarkadaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleCreateSession = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    context: {
                        mode: 'barkada',
                        outing_type: 'food',
                        group_size: 4,
                        budget: 'mid',
                        distance_km: 5,
                        time_of_day: 'anytime',
                    },
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to create session');
            }

            const data = await res.json();
            const sessionCode: string = data.session?.code;
            if (sessionCode) {
                router.push(`/barkada/${sessionCode}/lobby`);
            }
        } catch (err) {
            console.error('Create session error:', err);
            setError('Hindi makagawa ng session. Subukan ulit.');
            setLoading(false);
        }
    };

    const handleJoinSession = async () => {
        const code = joinCode.trim().toUpperCase();
        if (code.length < 4) {
            setError('Mangyaring maglagay ng valid na session code.');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            // Join the session first to create a participant record
            const joinRes = await fetch(`/api/session/${code}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname: 'Barkada Member' }),
            });

            if (!joinRes.ok) {
                const errData = await joinRes.json().catch(() => ({}));
                throw new Error(errData.error || 'Session not found or expired.');
            }

            const joinData = await joinRes.json();
            const participantId = joinData.participant?.id;
            if (participantId) {
                sessionStorage.setItem('aya_participant_id', participantId);
            }

            router.push(`/barkada/${code}/lobby`);
        } catch (err) {
            console.error('Join session error:', err);
            setError(err instanceof Error ? err.message : 'Hindi makasali sa session. Subukan ulit.');
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleJoinSession();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-[#F5F0E8] max-w-[430px] mx-auto">
            {/* Aya Flame Logo */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mb-8"
            >
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    aria-label="Aya flame logo"
                >
                    <circle cx="40" cy="40" r="38" fill="#FDF0EA" stroke="#E8622A" strokeWidth="2" />
                    <path
                        d="M40 16c-4 10-6 16-6 22 0 10 6 14 6 14s6-4 6-14c0-6-2-12-6-22z"
                        fill="#E8622A"
                    />
                    <path
                        d="M40 16c4 10 6 16 6 22 0 10-6 14-6 14s-6-4-6-14c0-6 2-12 6-22z"
                        fill="#E8622A"
                        opacity="0.4"
                    />
                </svg>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="text-3xl font-bold text-[#1A1A1A] mb-2 text-center"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                Barkada Mode
            </motion.h1>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="text-base text-[#6B6B6B] mb-10 text-center"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                Everyone swipes. Aya finds the match.
            </motion.p>

            {/* Create Session Button */}
            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                type="button"
                onClick={handleCreateSession}
                disabled={loading}
                className="w-full py-4 rounded-xl text-white text-lg font-semibold mb-6 transition-all active:scale-95 disabled:opacity-60"
                style={{
                    backgroundColor: 'var(--color-brand)',
                    fontFamily: 'var(--font-body)',
                }}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="animate-spin"
                        >
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                            <path
                                d="M12 2a10 10 0 0 1 10 10"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                        Gumagawa...
                    </span>
                ) : (
                    'Gumawa ng Session'
                )}
            </motion.button>

            {/* Divider */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-3 w-full mb-6"
            >
                <div className="flex-1 h-px bg-[#E8E5DF]" />
                <span
                    className="text-xs text-[#9E9E9E] uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    o
                </span>
                <div className="flex-1 h-px bg-[#E8E5DF]" />
            </motion.div>

            {/* Join Session */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="w-full"
            >
                <label
                    className="text-sm font-semibold text-[#1A1A1A] mb-2 block"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    Sumali sa Session
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => {
                            setJoinCode(e.target.value.toUpperCase());
                            setError(null);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="AYA-XXXX"
                        maxLength={8}
                        className="flex-1 px-4 py-3 rounded-xl border text-base uppercase tracking-widest text-center"
                        style={{
                            borderColor: 'var(--color-border)',
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text-primary)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '1.125rem',
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleJoinSession}
                        disabled={joinCode.trim().length < 4}
                        className="px-6 py-3 rounded-xl text-white font-semibold transition-all active:scale-95 disabled:opacity-40"
                        style={{
                            backgroundColor: 'var(--color-brand)',
                            fontFamily: 'var(--font-body)',
                        }}
                    >
                        Sumali
                    </button>
                </div>
            </motion.div>

            {/* Error */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-red-500 text-center"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}
