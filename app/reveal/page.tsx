'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BottomNav from '@/components/ui/BottomNav';
import { MOCK_ESTABLISHMENTS } from '@/lib/data/mock';
import { MapPin, ExternalLink, Share2, Sparkles } from 'lucide-react';

export default function RevealPage() {
  const router = useRouter();
  const winner = MOCK_ESTABLISHMENTS[1]; // Hardcoded for demo

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
            <Image 
              src={winner.photo} 
              alt={winner.name}
              fill
              className="object-cover"
            />
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
