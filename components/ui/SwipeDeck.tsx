'use client';

import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Establishment, SessionContext, SwipeRecord } from '@/types';
import SwipeCard from './SwipeCard';

interface SwipeDeckProps {
    establishments: Establishment[];
    context: SessionContext;
    sessionId: string;
    participantId: string;
    onComplete: () => void;
}

interface UndoEntry {
    establishment: Establishment;
    direction: 'left' | 'right';
    speedMs: number;
    dragDistance: number;
}

export default function SwipeDeck({
    establishments,
    context,
    sessionId,
    participantId,
    onComplete,
}: SwipeDeckProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
    const [swipeHistory, setSwipeHistory] = useState<SwipeRecord[]>([]);
    const [showAyaDecides, setShowAyaDecides] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const swipeCountRef = useRef(0);

    const totalCards = establishments.length;
    const currentEstablishment = establishments[currentIndex] ?? null;

    const postSwipe = useCallback(
        async (direction: 'left' | 'right', speedMs: number, dragDistance: number) => {
            if (!currentEstablishment) return;

            try {
                await fetch('/api/swipe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        session_id: sessionId,
                        participant_id: participantId,
                        establishment_id: currentEstablishment.id,
                        direction,
                        speed_ms: speedMs,
                        drag_distance: dragDistance,
                    }),
                });
            } catch (err) {
                console.error('Failed to record swipe:', err);
            }
        },
        [currentEstablishment, sessionId, participantId]
    );

    const handleSwipe = useCallback(
        async (direction: 'left' | 'right', speedMs: number, dragDistance: number) => {
            if (!currentEstablishment || isExiting) return;

            setIsExiting(true);

            // Record swipe to server
            await postSwipe(direction, speedMs, dragDistance);

            // Push to undo stack
            setUndoStack((prev) => [
                ...prev,
                {
                    establishment: currentEstablishment,
                    direction,
                    speedMs,
                    dragDistance,
                },
            ]);

            // Track swipe count for "Aya Decides" button
            swipeCountRef.current += 1;
            if (swipeCountRef.current >= 3 && context.mode === 'solo') {
                setShowAyaDecides(true);
            }

            // Add to history
            setSwipeHistory((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    session_id: sessionId,
                    participant_id: participantId,
                    establishment_id: currentEstablishment.id,
                    direction,
                    speed_ms: speedMs,
                    drag_distance: dragDistance,
                    created_at: new Date().toISOString(),
                },
            ]);

            // Advance after a brief delay for exit animation
            setTimeout(() => {
                const nextIndex = currentIndex + 1;
                if (nextIndex >= totalCards) {
                    // Mark participant as done
                    fetch(`/api/participants/${participantId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'done' }),
                    }).catch((err) => console.error('Failed to mark done:', err));

                    onComplete();
                } else {
                    setCurrentIndex(nextIndex);
                }
                setIsExiting(false);
            }, 300);
        },
        [
            currentEstablishment,
            currentIndex,
            totalCards,
            isExiting,
            postSwipe,
            sessionId,
            participantId,
            context.mode,
            onComplete,
        ]
    );

    const handleUndo = useCallback(() => {
        if (undoStack.length === 0) return;

        const lastEntry = undoStack[undoStack.length - 1];
        setUndoStack((prev) => prev.slice(0, -1));
        setCurrentIndex((prev) => Math.max(0, prev - 1));

        // Remove last swipe from history
        setSwipeHistory((prev) => prev.slice(0, -1));

        // Decrement swipe count
        swipeCountRef.current = Math.max(0, swipeCountRef.current - 1);
        if (swipeCountRef.current < 3) {
            setShowAyaDecides(false);
        }
    }, [undoStack]);

    const handleAyaDecides = useCallback(() => {
        // Auto-swipe right on remaining cards rapidly
        const remaining = totalCards - currentIndex;
        if (remaining <= 0) return;

        let delay = 0;
        for (let i = 0; i < remaining; i++) {
            setTimeout(() => {
                handleSwipe('right', 500, 200);
            }, delay);
            delay += 350;
        }
    }, [totalCards, currentIndex, handleSwipe]);

    // Stack styles for cards below the top
    const getStackStyle = (offset: number) => {
        const styles: Record<number, { scale: number; y: number; opacity: number; zIndex: number }> = {
            0: { scale: 1, y: 0, opacity: 1, zIndex: 30 },
            1: { scale: 0.95, y: 8, opacity: 0.8, zIndex: 20 },
            2: { scale: 0.9, y: 16, opacity: 0.6, zIndex: 10 },
        };
        return styles[offset] ?? { scale: 0.85, y: 24, opacity: 0.4, zIndex: 0 };
    };

    // Empty deck state
    if (!currentEstablishment && currentIndex >= totalCards) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
                <span className="text-6xl">🎉</span>
                <h2 className="text-xl font-bold text-[#1A1A1A] text-center">
                    Wala nang cards!
                </h2>
                <p className="text-sm text-[#6B6B6B] text-center">
                    {context.mode === 'solo'
                        ? 'Check your matches below.'
                        : 'Waiting for everyone to finish...'}
                </p>
            </div>
        );
    }

    return (
        <div className="relative w-full flex flex-col items-center">
            {/* Card stack container */}
            <div className="relative w-full flex justify-center" style={{ minHeight: '520px' }}>
                {/* Render up to 3 cards visible in stack */}
                {[0, 1, 2].map((offset) => {
                    const idx = currentIndex + offset;
                    if (idx >= totalCards) return null;

                    const est = establishments[idx];
                    const stackStyle = getStackStyle(offset);
                    const isTopCard = offset === 0;

                    return (
                        <AnimatePresence key={est.id} mode="popLayout">
                            <motion.div
                                className="absolute w-full flex justify-center"
                                style={{
                                    zIndex: stackStyle.zIndex,
                                }}
                                initial={
                                    offset === 0
                                        ? { scale: 0.9, opacity: 0, y: 20 }
                                        : { scale: stackStyle.scale, y: stackStyle.y, opacity: stackStyle.opacity }
                                }
                                animate={{
                                    scale: stackStyle.scale,
                                    y: stackStyle.y,
                                    opacity: stackStyle.opacity,
                                }}
                                exit={{
                                    x: isTopCard ? (undoStack.length > 0 && undoStack[undoStack.length - 1]?.direction === 'right' ? 400 : -400) : 0,
                                    opacity: 0,
                                    transition: { duration: 0.3, ease: 'easeIn' },
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 25,
                                }}
                            >
                                <SwipeCard
                                    establishment={est}
                                    context={context}
                                    cardIndex={idx}
                                    totalCards={totalCards}
                                    onSwipe={handleSwipe}
                                    onUndo={isTopCard && undoStack.length > 0 ? handleUndo : undefined}
                                    isTop={isTopCard && !isExiting}
                                />
                            </motion.div>
                        </AnimatePresence>
                    );
                })}
            </div>

            {/* Aya Decides button (hidden, appears after 3+ swipes in solo mode) */}
            {showAyaDecides && context.mode === 'solo' && (
                <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 px-6 py-2.5 rounded-full bg-[#E8622A] text-white text-sm font-semibold shadow-lg hover:bg-[#D4551E] active:scale-95 transition-transform"
                    onClick={handleAyaDecides}
                >
                    ✨ Aya Decides
                </motion.button>
            )}
        </div>
    );
}
