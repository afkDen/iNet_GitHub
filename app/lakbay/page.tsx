'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Map, Clock, Wallet, MapPin, Sparkles, ArrowLeft, ExternalLink, Navigation } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';
import { useSession } from '@/components/providers/SessionProvider';
import { selectItinerary } from '@/lib/session/itinerary-selector';
import { Itinerary } from '@/types';

export default function LakbayPage() {
  const router = useRouter();
  const { context } = useSession();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  useEffect(() => {
    const selected = selectItinerary(context);
    setItinerary(selected);
  }, [context]);

  if (!itinerary) return null;

  return (
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen pb-24">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <button 
          onClick={() => router.push('/onboarding')}
          className="p-2 -ml-2 text-aya-muted hover:text-aya-primary transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-black text-aya-secondary tracking-tight italic">lakbay</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-aya-muted">Planned by Aya</p>
        </div>
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Intro Note */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={48} className="text-aya-primary" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-aya-primary/10 flex items-center justify-center">
              <Sparkles size={16} className="text-aya-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-aya-primary">Aya's Note</span>
          </div>
          <p className="text-aya-secondary font-bold leading-relaxed italic">
            "{itinerary.aya_note}"
          </p>
          <div className="mt-4 flex gap-4 border-t border-aya-muted/10 pt-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-aya-muted">Cost</span>
              <span className="font-bold text-aya-secondary text-sm">₱{itinerary.total_cost_per_head}/head</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-aya-muted">Duration</span>
              <span className="font-bold text-aya-secondary text-sm">{itinerary.total_hours} Hours</span>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-6 relative">
          {/* Timeline Connector */}
          <div className="absolute left-[19px] top-8 bottom-8 w-1 bg-aya-muted/10 rounded-full" />

          {itinerary.stops.map((stop, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-6 group"
            >
              {/* Node */}
              <div className="relative z-10 flex flex-col items-center pt-2">
                <div className="w-10 h-10 rounded-full bg-white shadow-md border-2 border-aya-primary/20 flex items-center justify-center text-aya-primary font-black text-xs">
                  {index + 1}
                </div>
              </div>

              {/* Stop Card */}
              <div className="flex-1 space-y-3 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-aya-muted">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{stop.time}</span>
                  </div>
                  {stop.transport_to_next !== 'End of trip' && (
                    <div className="flex items-center gap-1.5 text-aya-primary bg-aya-primary/10 px-2 py-0.5 rounded-full">
                      <Navigation size={10} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{stop.transport_to_next}</span>
                    </div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-white hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-aya-muted mb-0.5">{stop.category}</p>
                      <h3 className="text-lg font-black text-aya-secondary leading-tight">{stop.name}</h3>
                    </div>
                    <span className="text-aya-muted font-bold text-xs italic">₱{stop.cost_per_head}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {stop.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold bg-aya-bg text-aya-muted px-2 py-0.5 rounded-md border border-aya-muted/10">#{tag}</span>
                    ))}
                  </div>

                  <button className="w-full bg-aya-secondary text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors">
                    <ExternalLink size={14} />
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <button 
            onClick={() => router.push('/onboarding')}
            className="w-full bg-aya-primary text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Gamitin Itong Plan!
            <Sparkles size={20} />
          </button>
          <p className="text-center text-[10px] text-aya-muted font-bold uppercase tracking-widest mt-4">
            Aya selected the best preset for your vibe
          </p>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
