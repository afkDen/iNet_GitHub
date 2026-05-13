'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Utensils, Users, MapPin } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-aya-bg">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-sm"
        >
          <div className="space-y-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-8xl font-black text-aya-primary tracking-tighter italic select-none">
                aya
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-1"
            >
              <p className="text-xl font-bold text-aya-secondary leading-tight">
                Kwentuhan. Hain. Labas Na.
              </p>
              <p className="text-aya-muted font-medium text-sm px-4">
                The AI-integrated decision app that solves the &ldquo;Saan tayo kakain?&rdquo; dilemma for your barkada.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 space-y-6"
          >
            <button
              onClick={() => router.push('/onboarding')}
              className="w-full bg-aya-primary text-white text-xl font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              Simulan na!
              <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
            </button>
            
            <div className="flex justify-center gap-8 pt-4">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-aya-primary border border-aya-muted/10">
                  <Utensils size={22} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-aya-muted">Kain</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-aya-primary border border-aya-muted/10">
                  <Users size={22} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-aya-muted">Barkada</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-aya-primary border border-aya-muted/10">
                  <MapPin size={22} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-aya-muted">Gala</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer / Attribution */}
      <footer className="p-8 text-center">
        <p className="text-aya-muted text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">
          Bahala na si Aya &bull; iNet Hackathon 2026
        </p>
      </footer>
    </div>
  );
}
