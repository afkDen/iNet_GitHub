'use client';

import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import Image from 'next/image';
import { clsx } from 'clsx';
import type { Establishment, SessionContext } from '@/types';
import { useVibeAI } from '@/hooks/useVibeAI';
import VibeBadge from './VibeBadge';

interface SwipeCardProps {
    establishment: Establishment;
    context: SessionContext;
    cardIndex: number;
    totalCards: number;
    onSwipe: (direction: 'left' | 'right', speedMs: number, dragDistance: number) => void;
    onUndo?: () => void;
    isTop: boolean;
}

const SWIPE_THRESHOLD = 100;
const MAX_ROTATION = 15;

export default function SwipeCard({
    establishment,
    context,
    cardIndex,
    totalCards,
    onSwipe,
    onUndo,
    isTop,
}: SwipeCardProps) {
    const { tags, loading: vibeLoading } = useVibeAI(establishment, context);
    const startTimeRef = useRef<number>(Date.now());

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 0, 200], [-MAX_ROTATION, 0, MAX_ROTATION]);
    const approveOpacity = useTransform(x, [0, 50], [0, 0.3]);
    const skipOpacity = useTransform(x, [-50, 0], [0.3, 0]);

    const handleDragStart = useCallback(() => {
        startTimeRef.current = Date.now();
    }, []);

    const handleDragEnd = useCallback(
        (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
            const speedMs = Date.now() - startTimeRef.current;
            const dragDistance = Math.abs(info.offset.x);

            if (info.offset.x > SWIPE_THRESHOLD) {
                onSwipe('right', speedMs, dragDistance);
            } else if (info.offset.x < -SWIPE_THRESHOLD) {
                onSwipe('left', speedMs, dragDistance);
            }
            // If not past threshold, Framer Motion springs back automatically
        },
        [onSwipe]
    );

    const displayTags = tags.length >= 3 ? tags : establishment.vibe_tags;
    const hasUndo = typeof onUndo === 'function';

    return (
        <motion.div
            className={clsx(
                'relative w-full max-w-[360px] mx-auto rounded-[20px] bg-white overflow-hidden',
                'shadow-[0_2px_12px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)]',
                isTop && 'touch-none'
            )}
            style={{
                x,
                rotate,
                cursor: isTop ? 'grab' : 'default',
            }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            whileTap={isTop ? { cursor: 'grabbing' } : {}}
        >
            {/* Swipe overlays */}
            {isTop && (
                <>
                    {/* Approve overlay (green, right swipe) */}
                    <motion.div
                        className="absolute inset-0 z-10 pointer-events-none rounded-[20px]"
                        style={{ backgroundColor: '#22C55E', opacity: approveOpacity }}
                    />
                    {/* Skip overlay (red, left swipe) */}
                    <motion.div
                        className="absolute inset-0 z-10 pointer-events-none rounded-[20px]"
                        style={{ backgroundColor: '#EF4444', opacity: skipOpacity }}
                    />
                </>
            )}

            {/* Badges row — absolute positioned top */}
            <div className="absolute top-3 left-3 right-3 z-20 flex justify-between pointer-events-none">
                <div className="flex gap-1.5">
                    {establishment.is_deal && (
                        <span className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 shadow-sm">
                            DEAL
                        </span>
                    )}
                </div>
                <div className="flex gap-1.5">
                    {establishment.is_community_pin && (
                        <span className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 shadow-sm">
                            COMMUNITY
                        </span>
                    )}
                </div>
            </div>

            {/* Photo */}
            <div className="relative w-full aspect-video bg-[#E8E3DA]">
                {establishment.photo_url ? (
                    <Image
                        src={establishment.photo_url}
                        alt={establishment.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 90vw, 360px"
                        priority={cardIndex === 0}
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
            </div>

            {/* Info section */}
            <div className="px-4 pt-3 pb-4">
                {/* Category · City */}
                <p className="text-xs uppercase tracking-wider text-[#9E9E9E] font-medium mb-1">
                    {establishment.category}
                    {establishment.city ? ` · ${establishment.city}` : ''}
                </p>

                {/* Venue name */}
                <h2 className="text-lg font-bold text-[#1A1A1A] leading-tight mb-2">
                    {establishment.name}
                </h2>

                {/* Meta row: distance · cost · open status */}
                <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-3">
                    <span className="inline-flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {context.distance_km}km
                    </span>
                    <span>·</span>
                    <span>
                        ~₱{establishment.cost_min}
                        {establishment.cost_max > establishment.cost_min
                            ? `–${establishment.cost_max}`
                            : ''}
                        /head
                    </span>
                    <span>·</span>
                    <span
                        className={clsx(
                            'font-medium',
                            establishment.is_open ? 'text-green-600' : 'text-red-500'
                        )}
                    >
                        {establishment.is_open ? 'Open now' : 'Closed'}
                    </span>
                </div>

                {/* Vibe badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {vibeLoading && displayTags.length === 0 ? (
                        <>
                            <span className="inline-block rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-400 animate-pulse">
                                Loading...
                            </span>
                        </>
                    ) : (
                        displayTags.slice(0, 4).map((tag) => (
                            <VibeBadge key={tag} tag={tag} variant="default" />
                        ))
                    )}
                    {displayTags.length > 4 && (
                        <span className="text-xs text-[#9E9E9E] self-center">
                            +{displayTags.length - 4}
                        </span>
                    )}
                </div>

                {/* Community note */}
                {establishment.is_community_pin && establishment.community_confirms > 0 && (
                    <p className="text-xs text-indigo-700 font-medium mb-3 inline-flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {establishment.community_confirms} community confirmation
                        {establishment.community_confirms > 1 ? 's' : ''}
                    </p>
                )}

                {/* Deal text */}
                {establishment.is_deal && establishment.deal_text && (
                    <p className="text-xs text-amber-700 font-medium mb-3 inline-flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                            <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        {establishment.deal_text}
                    </p>
                )}
            </div>

            {/* Action buttons row */}
            <div className="flex items-center justify-center gap-6 px-4 pb-4">
                {/* Skip (✕) */}
                <button
                    type="button"
                    onClick={() => onSwipe('left', 0, 0)}
                    className={clsx(
                        'w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold',
                        'bg-red-50 text-red-500 border-2 border-red-200',
                        'hover:bg-red-100 active:scale-95 transition-transform',
                        !isTop && 'pointer-events-none opacity-40'
                    )}
                    aria-label="Skip"
                    disabled={!isTop}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Undo (↩) */}
                <button
                    type="button"
                    onClick={onUndo}
                    className={clsx(
                        'w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold',
                        'bg-gray-100 text-gray-400 border-2 border-gray-200',
                        hasUndo
                            ? 'hover:bg-gray-200 active:scale-95 transition-transform'
                            : 'opacity-35 cursor-not-allowed'
                    )}
                    aria-label="Undo"
                    disabled={!hasUndo}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                </button>

                {/* Like (✓) */}
                <button
                    type="button"
                    onClick={() => onSwipe('right', 0, 0)}
                    className={clsx(
                        'w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold',
                        'bg-[#FDF0EA] text-[#E8622A] border-2 border-[#E8622A]/30',
                        'hover:bg-[#FDE8D8] active:scale-95 transition-transform',
                        !isTop && 'pointer-events-none opacity-40'
                    )}
                    aria-label="Like"
                    disabled={!isTop}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </button>
            </div>

            {/* Footer: Card N of M · Mode */}
            <div className="text-center pb-3">
                <p className="text-xs text-[#9E9E9E]">
                    Card {cardIndex + 1} of {totalCards} ·{' '}
                    {context.mode === 'solo'
                        ? 'Solo'
                        : context.mode === 'barkada'
                            ? 'Barkada'
                            : 'Lakbay'}{' '}
                    Mode
                </p>
            </div>
        </motion.div>
    );
}
