'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BottomNav from '@/components/ui/BottomNav';
import { useSession } from '@/components/providers/SessionProvider';
import { MapPin, ExternalLink, Share2, Sparkles, Loader2 } from 'lucide-react';

export default function RevealPage() {
  const router = useRouter();
  const { sessionData } = useSession();
  const [winner, setWinner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDecision() {
      if (!sessionData?.code) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/match/${sessionData.code}/decide`);
        const data = await res.json();
        if (data.decision?.establishment) {
          const est = data.decision.establishment;
          setWinner({
            ...est,
            photo: est.photo_url,
            tags: est.vibe_tags
          });
        }
      } catch (err) {
        console.error('Failed to fetch decision:', err);
      } finally {
        setLoading(false);
      }
    }

    getDecision();
  }, [sessionData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-aya-bg gap-4">
        <Loader2 className="w-12 h-12 text-aya-primary animate-spin" />
        <p className="text-aya-secondary font-black text-xl animate-pulse">Aya is deciding...</p>
      </div>
    );
  }

  if (!winner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-aya-bg p-6 text-center gap-6">
        <div className="bg-white p-6 rounded-full shadow-lg border-2 border-aya-muted/20">
            <Sparkles className="text-aya-muted w-12 h-12" />
        </div>
        <div>
            <h1 className="text-2xl font-black text-aya-secondary uppercase">Wala pa tayong match, beh.</h1>
            <p className="text-aya-muted text-sm font-bold">Try swiping more or invite your friends!</p>
        </div>
        <button 
            onClick={() => router.push('/onboarding')}
            className="bg-aya-primary text-white font-black px-8 py-4 rounded-2xl shadow-lg"
        >
            Ulit tayo?
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen pb-24">
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-2"
        >
          <div className="flex justify-center mb-4">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-white p-4 rounded-full shadow-lg border-2 border-aya-primary"
            >
              <Sparkles className="text-aya-primary w-8 h-8" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-black text-aya-secondary tracking-tighter uppercase">Panalo!</h1>
          <p className="text-aya-muted font-bold tracking-widest text-xs uppercase">Aya decided your match</p>
        </motion.div>

        {/* Winner Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-[350px] bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white"
        >
          <div className="relative aspect-video">
            {winner.photo ? (
              <Image 
                src={winner.photo} 
                alt={winner.name}
                fill
                className="object-cover"
              />
            ) : (
                <div className="w-full h-full bg-aya-bg flex items-center justify-center">
                    <Sparkles size={48} className="text-aya-muted opacity-20" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{winner.category} • {winner.city}</p>
              <h2 className="text-2xl font-black">{winner.name}</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-aya-secondary font-bold">
              <MapPin size={16} className="text-aya-primary" />
              <span>{winner.address}</span>
            </div>

            <div className="flex gap-2">
              {winner.tags.map((tag: string) => (
                <span key={tag} className="text-[10px] font-bold bg-aya-bg text-aya-muted px-2 py-1 rounded-lg border border-aya-muted/10">#{tag}</span>
              ))}
            </div>

            <div className="pt-4 flex gap-3">
              <button className="flex-1 bg-aya-secondary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg hover:bg-black transition-colors">
                <ExternalLink size={16} />
                Open Maps
              </button>
              <button className="bg-aya-bg text-aya-secondary p-3 rounded-xl border border-aya-muted/20 shadow-sm hover:bg-white transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => router.push('/onboarding')}
          className="text-aya-muted font-bold text-sm hover:text-aya-secondary transition-colors"
        >
          Mag-aya ulit?
        </motion.button>
      </main>

      <BottomNav />
    </div>
  );
}
