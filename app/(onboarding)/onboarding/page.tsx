'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed, Compass, Calendar, User, Users, Map, ArrowRight, Sparkles, Minus, Plus } from 'lucide-react';
import type { SessionContext } from '@/types';

// ─── Step definitions ────────────────────────────────────────────────
const TOTAL_STEPS = 4;

type OutingType = 'food' | 'explore' | 'full_day';
type GroupMode = 'solo' | 'barkada' | 'lakbay';
type Budget = 'tipid' | 'mid' | 'bahala_na';
type Distance = 1 | 3 | 5 | 99; // 99 = Anywhere
type TimeOfDay = 'lunch' | 'merienda' | 'dinner' | 'anytime';

// ─── Step transition variants ────────────────────────────────────────
const stepVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -300 : 300,
        opacity: 0,
    }),
};

const stepTransition = {
    x: { type: 'spring' as const, stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
};

// ─── Progress Dots ────────────────────────────────────────────────────
function ProgressDots({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center justify-center gap-2 py-4">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${i <= current
                        ? 'w-6 bg-[#E85D26]'
                        : 'w-2 bg-[#D1C9BD]'
                        }`}
                />
            ))}
        </div>
    );
}

// ─── Choice Tile ──────────────────────────────────────────────────────
function ChoiceTile({
    icon: Icon,
    label,
    subtitle,
    selected,
    onClick,
}: {
    icon: React.ComponentType<{ className?: string; size?: number }>;
    label: string;
    subtitle: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 text-center ${selected
                ? 'border-[#E85D26] bg-[#FDF0EA] shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
                : 'border-[#E8E5DF] bg-white hover:border-[#E85D26]/30 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
                }`}
        >
            <Icon
                size={40}
                className={selected ? 'text-[#E85D26]' : 'text-[#6B6B6B]'}
            />
            <span
                className={`text-[15px] font-bold ${selected ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'
                    }`}
            >
                {label}
            </span>
            <span className="text-[11px] text-[#9E9E9E] leading-tight">
                {subtitle}
            </span>
        </motion.button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function OnboardingPage() {
    const router = useRouter();

    // Step tracking
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(0);

    // Step 1 — Outing type
    const [outingType, setOutingType] = useState<OutingType | null>(null);
    const [nlpInput, setNlpInput] = useState('');

    // Step 2 — Group mode + size
    const [groupMode, setGroupMode] = useState<GroupMode>('barkada');
    const [groupSize, setGroupSize] = useState(2);

    // Step 3 — Budget
    const [budget, setBudget] = useState<Budget | null>(null);

    // Step 4 — Distance + Time
    const [distance, setDistance] = useState<Distance>(3);
    const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('anytime');

    // Loading state for final submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ─── Navigation helpers ──────────────────────────────────────────
    const goNext = useCallback(() => {
        if (step < TOTAL_STEPS - 1) {
            setDirection(1);
            setStep((s) => s + 1);
        }
    }, [step]);

    const goPrev = useCallback(() => {
        if (step > 0) {
            setDirection(-1);
            setStep((s) => s - 1);
        }
    }, [step]);

    // ─── Step 1 validation ───────────────────────────────────────────
    const step1Valid = outingType !== null || nlpInput.trim().length > 0;

    // ─── Final submit ────────────────────────────────────────────────
    const handleFinalNext = async () => {
        const context: SessionContext = {
            mode: groupMode,
            outing_type: outingType ?? 'food',
            group_size: groupMode === 'solo' ? 1 : groupSize,
            budget: budget ?? 'mid',
            distance_km: distance === 99 ? 10 : distance,
            time_of_day: timeOfDay,
            natural_language: nlpInput.trim() || undefined,
        };

        setIsSubmitting(true);

        if (groupMode === 'lakbay') {
            router.push('/lakbay');
            return;
        }

        try {
            const res = await fetch('/api/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context }),
            });

            if (!res.ok) {
                console.error('Session creation failed');
                setIsSubmitting(false);
                return;
            }

            const data = await res.json();
            const sessionCode: string = data.session?.code;

            if (groupMode === 'barkada') {
                router.push(`/barkada/${sessionCode}/lobby`);
            } else {
                router.push(`/solo?sessionCode=${sessionCode}`);
            }
        } catch (err) {
            console.error('Session creation error', err);
            setIsSubmitting(false);
        }
    };

    // ─── Surprise Me ─────────────────────────────────────────────────
    const handleSurpriseMe = () => {
        // Randomize everything and skip to solo mode
        const surpriseContext: SessionContext = {
            mode: 'solo',
            outing_type: 'food',
            group_size: 1,
            budget: 'mid',
            distance_km: 5,
            time_of_day: 'anytime',
        };

        setIsSubmitting(true);
        fetch('/api/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ context: surpriseContext }),
        })
            .then((res) => res.json())
            .then((data) => {
                const code = data.session?.code;
                router.push(`/solo?session=${code}`);
            })
            .catch(() => {
                setIsSubmitting(false);
            });
    };

    // ─── Render ──────────────────────────────────────────────────────
    return (
        <div className="flex flex-col min-h-full max-w-[430px] mx-auto px-5 pb-8">
            {/* Progress dots */}
            <ProgressDots current={step} total={TOTAL_STEPS} />

            {/* Step content with animation */}
            <div className="flex-1 relative overflow-hidden min-h-0">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={stepTransition}
                        className="w-full"
                    >
                        {/* ── STEP 1: Mode Selection ── */}
                        {step === 0 && (
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h1 className="text-[28px] font-black text-[#1A1A1A] leading-tight">
                                        Where are you headed today?
                                    </h1>
                                    <p className="text-sm text-[#6B6B6B] mt-1">
                                        Pick your outing type to get started.
                                    </p>
                                </div>

                                {/* 2x2 grid — 3 tiles, 4th slot empty */}
                                <div className="grid grid-cols-2 gap-3">
                                    <ChoiceTile
                                        icon={UtensilsCrossed}
                                        label="Food & Drinks"
                                        subtitle="Restaurants, cafes, carinderias"
                                        selected={outingType === 'food'}
                                        onClick={() => setOutingType('food')}
                                    />
                                    <ChoiceTile
                                        icon={Compass}
                                        label="Explore"
                                        subtitle="Parks, markets, hidden spots"
                                        selected={outingType === 'explore'}
                                        onClick={() => setOutingType('explore')}
                                    />
                                    <ChoiceTile
                                        icon={Calendar}
                                        label="Full Day"
                                        subtitle="Itinerary from lunch to dinner"
                                        selected={outingType === 'full_day'}
                                        onClick={() => setOutingType('full_day')}
                                    />
                                    {/* 4th slot intentionally empty */}
                                    <div />
                                </div>

                                {/* Natural language input */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={nlpInput}
                                        onChange={(e) => setNlpInput(e.target.value)}
                                        placeholder="Budget-friendly na pwede pang dalhin si lola..."
                                        className="w-full px-4 py-3.5 rounded-xl border border-[#E8E5DF] bg-white text-[15px] text-[#1A1A1A] placeholder:text-[#9E9E9E] focus:outline-none focus:border-[#E85D26] focus:ring-2 focus:ring-[#E85D26]/10 transition-all"
                                    />
                                    <span className="absolute left-4 -top-2.5 bg-[#F5F0E8] px-2 text-[11px] text-[#9E9E9E]">
                                        Or just type it out
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 2: Group Setup ── */}
                        {step === 1 && (
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h1 className="text-[28px] font-black text-[#1A1A1A] leading-tight">
                                        Who's coming?
                                    </h1>
                                </div>

                                {/* Mode tiles */}
                                <div className="grid grid-cols-3 gap-3">
                                    {([
                                        { mode: 'solo' as GroupMode, icon: User, label: 'Solo' },
                                        { mode: 'barkada' as GroupMode, icon: Users, label: 'Barkada' },
                                        { mode: 'lakbay' as GroupMode, icon: Map, label: 'Lakbay' },
                                    ]).map(({ mode, icon: Icon, label }) => (
                                        <motion.button
                                            key={mode}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => setGroupMode(mode)}
                                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${groupMode === mode
                                                ? 'border-[#E85D26] bg-[#FDF0EA] shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
                                                : 'border-[#E8E5DF] bg-white hover:border-[#E85D26]/30'
                                                }`}
                                        >
                                            <Icon
                                                size={32}
                                                className={
                                                    groupMode === mode ? 'text-[#E85D26]' : 'text-[#6B6B6B]'
                                                }
                                            />
                                            <span className="text-[15px] font-bold text-[#1A1A1A]">
                                                {label}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Number stepper — hidden for solo */}
                                {groupMode !== 'solo' && (
                                    <div className="flex flex-col items-center gap-3">
                                        <span className="text-sm text-[#6B6B6B]">How many?</span>
                                        <div className="flex items-center gap-5 bg-white rounded-2xl px-6 py-3 border border-[#E8E5DF] shadow-sm">
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() =>
                                                    setGroupSize((s) => Math.max(2, s - 1))
                                                }
                                                disabled={groupSize <= 2}
                                                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5F0E8] text-[#1A1A1A] disabled:opacity-30 transition-opacity"
                                            >
                                                <Minus size={20} />
                                            </motion.button>
                                            <span className="text-[28px] font-black text-[#1A1A1A] w-10 text-center tabular-nums">
                                                {groupSize}
                                            </span>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() =>
                                                    setGroupSize((s) => Math.min(12, s + 1))
                                                }
                                                disabled={groupSize >= 12}
                                                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5F0E8] text-[#1A1A1A] disabled:opacity-30 transition-opacity"
                                            >
                                                <Plus size={20} />
                                            </motion.button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── STEP 3: Budget ── */}
                        {step === 2 && (
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h1 className="text-[28px] font-black text-[#1A1A1A] leading-tight">
                                        Magkano ang budget?
                                    </h1>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {([
                                        {
                                            tier: 'tipid' as Budget,
                                            label: '₱ Tipid',
                                            desc: 'Under ₱150/head · Sikat sa masa',
                                            tint: 'bg-[#FFF5EC]',
                                            borderTint: 'border-[#F4A261]/40',
                                        },
                                        {
                                            tier: 'mid' as Budget,
                                            label: '₱₱ Mid',
                                            desc: '₱150–₱400/head · Pwede na',
                                            tint: 'bg-[#FFF0E8]',
                                            borderTint: 'border-[#E85D26]/30',
                                        },
                                        {
                                            tier: 'bahala_na' as Budget,
                                            label: '₱₱₱ Bahala Na',
                                            desc: '₱400+/head · Wag nang isipin',
                                            tint: 'bg-[#FFE8DC]',
                                            borderTint: 'border-[#E85D26]/50',
                                        },
                                    ]).map(({ tier, label, desc, tint, borderTint }) => (
                                        <motion.button
                                            key={tier}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setBudget(tier)}
                                            className={`w-full flex flex-col items-start gap-1 p-5 rounded-2xl border-2 transition-all duration-200 text-left ${tint} ${budget === tier
                                                ? 'border-[#E85D26] shadow-[0_4px_16px_rgba(232,93,38,0.15)]'
                                                : `${borderTint} hover:border-[#E85D26]/40`
                                                }`}
                                        >
                                            <span className="text-[20px] font-black text-[#1A1A1A]">
                                                {label}
                                            </span>
                                            <span className="text-[13px] text-[#6B6B6B]">
                                                {desc}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── STEP 4: Distance + Time ── */}
                        {step === 3 && (
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h1 className="text-[28px] font-black text-[#1A1A1A] leading-tight">
                                        Gaano kalayo? Kailan?
                                    </h1>
                                </div>

                                {/* Distance pills */}
                                <div>
                                    <p className="text-sm text-[#6B6B6B] mb-3">Distance</p>
                                    <div className="flex flex-wrap gap-2">
                                        {([
                                            { value: 1 as Distance, label: 'Within 1km' },
                                            { value: 3 as Distance, label: '3km' },
                                            { value: 5 as Distance, label: '5km' },
                                            { value: 99 as Distance, label: 'Anywhere' },
                                        ]).map(({ value, label }) => (
                                            <motion.button
                                                key={value}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setDistance(value)}
                                                className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-200 ${distance === value
                                                    ? 'bg-[#E85D26] text-white shadow-[0_2px_8px_rgba(232,93,38,0.3)]'
                                                    : 'bg-white text-[#6B6B6B] border border-[#E8E5DF] hover:border-[#E85D26]/40'
                                                    }`}
                                            >
                                                {label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time of day pills */}
                                <div>
                                    <p className="text-sm text-[#6B6B6B] mb-3">Time of day</p>
                                    <div className="flex flex-wrap gap-2">
                                        {([
                                            { value: 'lunch' as TimeOfDay, label: 'Lunch' },
                                            { value: 'merienda' as TimeOfDay, label: 'Merienda' },
                                            { value: 'dinner' as TimeOfDay, label: 'Dinner' },
                                            { value: 'anytime' as TimeOfDay, label: 'Anytime' },
                                        ]).map(({ value, label }) => (
                                            <motion.button
                                                key={value}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setTimeOfDay(value)}
                                                className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-200 ${timeOfDay === value
                                                    ? 'bg-[#E85D26] text-white shadow-[0_2px_8px_rgba(232,93,38,0.3)]'
                                                    : 'bg-white text-[#6B6B6B] border border-[#E8E5DF] hover:border-[#E85D26]/40'
                                                    }`}
                                            >
                                                {label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ─── Bottom actions ─── */}
            <div className="flex flex-col gap-3 pt-4">
                {/* Back + Next row */}
                <div className="flex items-center gap-3">
                    {step > 0 && (
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={goPrev}
                            className="px-5 py-3.5 rounded-xl border border-[#E8E5DF] bg-white text-[15px] font-semibold text-[#6B6B6B] hover:bg-[#F5F3EF] transition-colors"
                        >
                            Back
                        </motion.button>
                    )}

                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={
                            step === TOTAL_STEPS - 1
                                ? handleFinalNext
                                : goNext
                        }
                        disabled={
                            (step === 0 && !step1Valid) || isSubmitting
                        }
                        className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${(step === 0 && !step1Valid) || isSubmitting
                            ? 'bg-[#E8E5DF] text-[#9E9E9E] cursor-not-allowed'
                            : 'bg-[#E85D26] text-white hover:bg-[#D14F1E] shadow-[0_4px_16px_rgba(232,93,38,0.25)]'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                Hinahanap ni Aya...
                            </>
                        ) : (
                            <>
                                {step === TOTAL_STEPS - 1 ? 'Find my match' : 'Next'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Surprise Me — only on step 1 */}
                {step === 0 && (
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSurpriseMe}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-1.5 py-2 text-[13px] text-[#E85D26] font-medium hover:text-[#D14F1E] transition-colors disabled:opacity-40"
                    >
                        <Sparkles size={16} />
                        Surprise Me — skip all this
                    </motion.button>
                )}
            </div>
        </div>
    );
}
