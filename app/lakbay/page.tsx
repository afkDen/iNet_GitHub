'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Wallet, Clock, Map } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ItineraryCard from '@/components/ui/ItineraryCard';
import { itineraries } from '@/lib/data/itineraries';
import { Itinerary } from '@/types';

type BudgetTier = 'tipid' | 'mid' | 'bahala_na';

export default function LakbayPage() {
    const router = useRouter();
    const [step, setStep] = useState<'onboarding' | 'loading' | 'result'>('onboarding');
    const [budget, setBudget] = useState<BudgetTier | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const [currentItineraryIndex, setCurrentItineraryIndex] = useState(0);
    const [filteredItineraries, setFilteredItineraries] = useState<Itinerary[]>([]);

    const loadingMessages = [
        "Pinaplano ni Aya ang inyong araw... 🗺️",
        "Ine-optimize ang sequencing at budget...",
        "Halos tapos na...",
    ];

    useEffect(() => {
        if (step === 'loading') {
            const interval = setInterval(() => {
                setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step]);

    const handleStartPlanning = () => {
        setStep('loading');

        // Filter itineraries based on budget
        const matches = itineraries.filter(itin => itin.budget_tier === budget);
        setFilteredItineraries(matches.length > 0 ? matches : [itineraries[0]]);

        setTimeout(() => {
            setStep('result');
        }, 3000);
    };

    const handleSkip = () => {
        setCurrentItineraryIndex((prev) => (prev + 1) % filteredItineraries.length);
    };

    const handleAccept = () => {
        // In a real app, we'd pass the itinerary ID via state or query
        // For smoke & mirrors, we'll just navigate to the result page
        router.push(`/lakbay/result?id=${filteredItineraries[currentItineraryIndex].id}`);
    };

    if (step === 'onboarding') {
        return (
            <div className="min-h-screen bg-aya-bg flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[375px] space-y-8"
                >
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-aya-secondary">Lakbay Mode</h1>
                        <p className="text-aya-muted text-sm">Let Aya plan your perfect day.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase text-aya-muted ml-1">Budget</label>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: 'tipid', label: '₱ Grabe Tipid' },
                                    { id: 'mid', label: '₱₱ Kaya Naman' },
                                    { id: 'bahala_na', label: '₱₱₱ Bahala Na' },
                                ].map((tier) => (
                                    <button
                                        key={tier.id}
                                        onClick={() => setBudget(tier.id as BudgetTier)}
                                        className={`py-4 px-6 rounded-2xl border-2 text-left font-semibold transition-all ${budget === tier.id
                                                ? 'border-aya-primary bg-aya-primary text-white shadow-md'
                                                : 'border-[#E8E5DF] bg-white text-aya-secondary'
                                            }`}
                                    >
                                        {tier.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase text-aya-muted ml-1">Time Frame</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Half Day', 'Full Day'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTime(t)}
                                        className={`py-3 px-4 rounded-2xl border-2 text-center font-semibold transition-all ${time === t
                                                ? 'border-aya-primary bg-aya-primary text-white shadow-md'
                                                : 'border-[#E8E5DF] bg-white text-aya-secondary'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!budget || !time}
                        onClick={handleStartPlanning}
                        className="w-full py-4 rounded-2xl bg-aya-primary text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                    >
                        Plan My Day <Map className="inline-block ml-2" size={20} />
                    </button>
                </motion.div>
            </div>
        );
    }

    if (step === 'loading') {
        return (
            <div className="min-h-screen bg-aya-bg flex flex-col items-center justify-center p-6">
                <LoadingSpinner message={loadingMessages[loadingMessageIndex]} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-aya-bg flex flex-col items-center py-12 px-6">
            <div className="w-full max-w-[375px] flex flex-col items-center gap-8">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-aya-secondary">Your Itinerary</h2>
                    <p className="text-aya-muted text-sm">Aya found a plan that fits your budget!</p>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentItineraryIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <ItineraryCard
                            itinerary={filteredItineraries[currentItineraryIndex]}
                            onSkip={handleSkip}
                            onAccept={handleAccept}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
