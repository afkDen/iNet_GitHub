'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useSessionContext } from '@/components/providers/SessionProvider';
import { supabase } from '@/lib/supabase/client';

// SVG icons as inline SVGs (no emoji)
function StatusDot({ status }: { status: string }) {
    const color =
        status === 'done'
            ? '#2D7A4F'
            : status === 'swiping'
                ? '#D4A017'
                : '#9E9E9E';
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            aria-label={`Status: ${status}`}
        >
            <circle cx="5" cy="5" r="5" fill={color} />
        </svg>
    );
}

function AvatarSVG({ initials }: { initials: string }) {
    return (
        <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            aria-label={`Avatar for ${initials}`}
        >
            <circle cx="18" cy="18" r="18" fill="#E8E5DF" />
            <text
                x="18"
                y="18"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#6B6B6B"
                fontSize="13"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
            >
                {initials}
            </text>
        </svg>
    );
}

function LoadingSpinner() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-label="Loading"
            className="animate-spin"
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#E8E5DF"
                strokeWidth="3"
            />
            <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="#E8622A"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function BarkadaLobbyPage() {
    const params = useParams<{ code: string }>();
    const router = useRouter();
    const sessionCode = params?.code ?? '';

    const { session, participants, allDone, loading, error } =
        useSessionContext();

    const hasJoinedRef = useRef(false);

    useEffect(() => {
        if (!sessionCode) return;

        // Guard: prevent double-joining (React StrictMode double-invoke, navigation back-forward)
        const storedParticipantId = sessionStorage.getItem('aya_participant_id');
        if (storedParticipantId || hasJoinedRef.current) {
            return;
        }

        hasJoinedRef.current = true;

        const joinSession = async () => {
            try {
                const res = await fetch(`/api/session/${sessionCode}/join`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nickname: 'Barkada Member' }),
                });
                if (res.ok) {
                    const data = await res.json();
                    const pid = data.participant?.id;
                    if (pid) sessionStorage.setItem('aya_participant_id', pid);
                }
            } catch (err) {
                console.error('Auto-join error:', err);
            }
        };

        joinSession();
    }, [sessionCode]);

    // When all participants are done, redirect to reveal
    useEffect(() => {
        if (allDone && session) {
            const timer = setTimeout(() => {
                router.push(`/barkada/${sessionCode}/reveal`);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [allDone, session, sessionCode, router]);

    const handleCopyLink = async () => {
        const link = `${window.location.origin}/barkada/${sessionCode}/lobby`;
        try {
            await navigator.clipboard.writeText(link);
        } catch {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = link;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        }
    };

    const handleShare = async () => {
        const link = `${window.location.origin}/barkada/${sessionCode}/lobby`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join my Aya session!',
                    text: `Join my barkada session on Aya! Code: ${sessionCode}`,
                    url: link,
                });
            } catch {
                // User cancelled share
            }
        } else {
            await handleCopyLink();
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
                <LoadingSpinner />
                <p
                    className="text-sm"
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    Hinahanap ang session...
                </p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    aria-label="Error"
                >
                    <circle cx="24" cy="24" r="24" fill="#FDECEA" />
                    <path
                        d="M24 14v14M24 32v2"
                        stroke="#C0392B"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
                <p
                    className="text-base text-center"
                    style={{
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    {error}
                </p>
                <button
                    onClick={() => router.push('/onboarding')}
                    className="px-6 py-3 rounded-xl text-white font-semibold"
                    style={{
                        backgroundColor: 'var(--color-brand)',
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    Bumalik
                </button>
            </div>
        );
    }

    // No session yet (shouldn't happen if loading is done without error)
    if (!session) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen px-5 py-8 max-w-[430px] mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h1
                    className="text-2xl font-bold mb-2"
                    style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-text-primary)',
                    }}
                >
                    Barkada Session
                </h1>
                <p
                    className="text-sm"
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    I-share ang code para makasali ang tropa
                </p>
            </div>

            {/* Session Code Card */}
            <div
                className="rounded-xl p-6 mb-8 text-center"
                style={{ backgroundColor: '#1A1A1A' }}
            >
                <p
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{
                        color: 'var(--color-text-tertiary)',
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    SESSION CODE
                </p>
                <p
                    className="text-4xl font-medium mb-4 text-white"
                    style={{ fontFamily: 'var(--font-mono)' }}
                >
                    {session.code}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={handleCopyLink}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-body)',
                        }}
                    >
                        Copy Link
                    </button>
                    <button
                        onClick={handleShare}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-body)',
                        }}
                    >
                        Share
                    </button>
                </div>
            </div>

            {/* Participant List */}
            <div className="flex-1">
                <h2
                    className="text-sm font-semibold uppercase tracking-wider mb-4"
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    Participants ({participants.length})
                </h2>

                {participants.length === 0 ? (
                    <div
                        className="rounded-xl p-6 text-center"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <p
                            className="text-sm"
                            style={{
                                color: 'var(--color-text-tertiary)',
                                fontFamily: 'var(--font-body)',
                            }}
                        >
                            Waiting for participants to join...
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {participants.map((p) => {
                            const initials = (p.nickname || '?')
                                .slice(0, 2)
                                .toUpperCase();
                            const isYou =
                                typeof window !== 'undefined' &&
                                sessionStorage.getItem(
                                    'aya_participant_id'
                                ) === p.id;

                            return (
                                <li
                                    key={p.id}
                                    className="flex items-center gap-3 rounded-xl p-3"
                                    style={{
                                        backgroundColor:
                                            'var(--color-surface)',
                                        border:
                                            '1px solid var(--color-border)',
                                    }}
                                >
                                    <AvatarSVG initials={initials} />
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="text-sm font-medium truncate"
                                            style={{
                                                color: 'var(--color-text-primary)',
                                                fontFamily:
                                                    'var(--font-body)',
                                            }}
                                        >
                                            {p.nickname || 'Anonymous'}
                                            {isYou && (
                                                <span
                                                    className="ml-1.5 text-xs"
                                                    style={{
                                                        color: 'var(--color-text-tertiary)',
                                                    }}
                                                >
                                                    (you)
                                                </span>
                                            )}
                                        </p>
                                        <p
                                            className="text-xs"
                                            style={{
                                                color: 'var(--color-text-tertiary)',
                                                fontFamily:
                                                    'var(--font-body)',
                                            }}
                                        >
                                            {p.status === 'done'
                                                ? 'Done'
                                                : p.status === 'swiping'
                                                    ? 'Swiping...'
                                                    : 'Waiting...'}
                                        </p>
                                    </div>
                                    <StatusDot status={p.status} />
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* All Done Banner */}
            {allDone && (
                <div
                    className="rounded-xl p-4 mt-6 text-center"
                    style={{
                        backgroundColor: 'var(--color-approve-light)',
                        border: '1px solid var(--color-approve)',
                    }}
                >
                    <p
                        className="text-sm font-semibold"
                        style={{
                            color: 'var(--color-approve)',
                            fontFamily: 'var(--font-body)',
                        }}
                    >
                        Everyone is done! Redirecting to results...
                    </p>
                </div>
            )}

            {/* Footer Notice */}
            <div className="mt-6 text-center">
                <p
                    className="text-xs"
                    style={{
                        color: 'var(--color-text-tertiary)',
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    Results appear automatically once everyone finishes.
                    No one sees anyone else's choices until then.
                </p>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8">
                <button
                    onClick={async () => {
                        const pid = sessionStorage.getItem('aya_participant_id');
                        if (pid) {
                            await fetch(`/api/participants/${pid}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'swiping' }),
                            });
                            router.push(`/barkada/${sessionCode}/swipe`);
                        }
                    }}
                    className="w-full py-4 rounded-2xl bg-[#E8622A] text-white font-bold shadow-lg active:scale-95 transition-transform"
                >
                    Magsimula
                </button>
            </div>
        </div>
    );
}
