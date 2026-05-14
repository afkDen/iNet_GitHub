'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ItineraryCard from '@/components/ui/ItineraryCard';
import { itineraries } from '@/lib/data/itineraries';
import { notFound } from 'next/navigation';

export default function LakbayResultPage() {
    const searchParams = useSearchParams();
    const itineraryId = searchParams.get('id');

    const itinerary = itineraries.find(itin => itin.id === itineraryId);

    if (!itinerary) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-aya-bg flex flex-col items-center py-12 px-6">
            <div className="w-full max-w-[375px] flex flex-col items-center gap-8">
                <div className="text-center space-y-2">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block px-3 py-1 bg-aya-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-2"
                    >
                        Plan Locked In
                    </motion.div>
                    <h2 className="text-2xl font-bold text-aya-secondary">Ready for your trip!</h2>
                    <p className="text-aya-muted text-sm">Aya has finalized your itinerary. Enjoy your day!</p>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                >
                    <ItineraryCard
                        itinerary={itinerary}
                        isAccepted={true}
                        onAccept={() => { }} // No-op in accepted state
                        onSkip={() => { }}   // No-op in accepted state
                    />
                </motion.div>
            </div>
        </div>
    );
}
