'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BottomNav from '@/components/ui/BottomNav';
import { useSession as useSessionProvider } from '@/components/providers/SessionProvider';
import { useSession } from '@/hooks/useSession';
import { MapPin, ExternalLink, Share2, Sparkles, Loader2, Users, Heart } from 'lucide-react';

export default function BarkadaRevealPage({ params }: { params: Promise<{ sessionCode: string }> }) {
  const router = useRouter();
  const { sessionCode } = use(params);
  const { sessionData } = useSessionProvider();
  const { participants, loading: sessionLoading } = useSession(sessionCode);
  const [winner, setWinner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    if (participants.length > 0) {
      const everyoneDone = participants.every(p => p.is_done);
      setAllDone(everyoneDone);
      
      if (everyoneDone) {
        getDecision();
      }
    }
  }, [participants]);

  async function getDecision() {
    try {
      const res = await fetch(`/api/match/${sessionCode}/decide`);
      const data = await res.json();
      if (data.decision?.establishment) {
        const est = data.decision.establishment;
        setWinner({
          ...est,
          photo: est.photo_url,
          tags: est.vibe_tags,
          right_swipes: data.decision.right_swipe_count,
          score: data.decision.enthusiasm_score
        });
      }
    } catch (err) {
      console.error('Failed to fetch decision:', err);
    } finally {
      setLoading(false);
    }
  }

  if (sessionLoading || (allDone && loading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-aya-bg gap-4">
        <Loader2 className="w-12 h-12 text-aya-primary animate-spin" />
        <p className="text-aya-secondary font-black text-xl animate-pulse italic">Aya is deciding for the group...</p>
      </div>
    );
  }

  if (!allDone) {
    const doneCount = participants.filter(p => p.is_done).length;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-aya-bg p-6 text-center gap-8">
        <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-aya-primary/30 animate-spin-slow flex items-center justify-center">
                <Users size={48} className="text-aya-muted opacity-50" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-aya-primary">{doneCount}/{participants.length}</span>
            </div>
        </div>
        <div>
            <h1 className="text-2xl font-black text-aya-secondary uppercase tracking-tight">Hintay lang, beh...</h1>
            <p className="text-aya-muted font-bold text-sm max-w-[250px] mx-auto mt-2">
              We're waiting for your other friends to finish swiping. Results will appear automatically.
            </p>
        </div>
        <div className="w-full max-w-xs space-y-2">
            {participants.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-white">
                    <span className="font-bold text-aya-secondary">{p.nickname}</span>
                    {p.is_done ? (
                        <span className="text-[10px] font-black text-green-600 bg-green-100 px-2 py-1 rounded-full">DONE ✅</span>
                    ) : (
                        <span className="text-[10px] font-black text-aya-muted bg-aya-bg px-2 py-1 rounded-full animate-pulse">SWIPING...</span>
                    )}
                </div>
            ))}
        </div>
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
            <h1 className="text-2xl font-black text-aya-secondary uppercase">Wala kayong match!</h1>
            <p className="text-aya-muted text-sm font-bold">Incompatible yata ang barkada today. Try another round?</p>
        </div>
        <button 
            onClick={() => router.push('/onboarding')}
            className="bg-aya-primary text-white font-black px-8 py-4 rounded-2xl shadow-lg"
        >
            Bagong Session
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
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-aya-primary p-4 rounded-full shadow-lg"
            >
              <Users className="text-white w-8 h-8" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-black text-aya-secondary tracking-tighter uppercase leading-none">Barkada Pick!</h1>
          <p className="text-aya-muted font-bold tracking-widest text-xs uppercase">The group has spoken</p>
        </motion.div>

        {/* Winner Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-[350px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white"
        >
          <div className="relative aspect-square">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Group Stats Overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white">
                <Heart size={14} className="text-aya-primary fill-aya-primary" />
                <span className="text-xs font-black text-aya-secondary">{winner.right_swipes}/{participants.length} Liked this</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{winner.category} • {winner.city}</p>
              <h2 className="text-3xl font-black leading-tight">{winner.name}</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 text-sm text-aya-secondary font-bold bg-aya-bg/50 p-3 rounded-xl border border-aya-muted/10">
              <MapPin size={18} className="text-aya-primary shrink-0" />
              <span className="leading-snug">{winner.address}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {winner.tags.map((tag: string) => (
                <span key={tag} className="text-[10px] font-bold bg-aya-secondary text-white px-3 py-1.5 rounded-full">#{tag}</span>
              ))}
            </div>

            <div className="pt-2 flex gap-3">
              <button className="flex-1 bg-aya-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all">
                <ExternalLink size={18} />
                Open Maps
              </button>
              <button className="bg-white text-aya-secondary p-4 rounded-2xl border-2 border-aya-bg shadow-sm hover:bg-aya-bg transition-colors">
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
          className="text-aya-muted font-bold text-sm hover:text-aya-secondary transition-colors italic underline underline-offset-4"
        >
          Kwentuhan ulit?
        </motion.button>
      </main>

      <BottomNav />
    </div>
  );
}
