'use client';

import { use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Share2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';
import { useSession as useSessionProvider } from '@/components/providers/SessionProvider';
import { useSession } from '@/hooks/useSession';

function LobbyContent({ params }: { params: Promise<{ sessionCode: string }> }) {
  const router = useRouter();
  const { sessionCode } = use(params);
  const { participant } = useSessionProvider();
  const { session, participants, loading } = useSession(sessionCode);

  const handleShare = () => {
    const url = `${window.location.origin}/onboarding?join=${sessionCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Aya — Bahala na si Aya',
        text: `Join my barkada session on Aya: ${sessionCode}`,
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-aya-bg gap-4">
              <Loader2 className="w-12 h-12 text-aya-primary animate-spin" />
              <p className="text-aya-secondary font-black text-xl animate-pulse italic">Hinahanap ni Aya...</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen pb-24">
      <header className="p-6">
        <h1 className="text-3xl font-black text-aya-primary tracking-tighter italic">aya</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <div className="text-center space-y-2">
          <div className="bg-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center mx-auto border-2 border-aya-primary/20 mb-4">
            <Users className="text-aya-primary w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-aya-secondary">Barkada Mode</h2>
          <p className="text-aya-muted text-sm max-w-[250px]">Share this code with your friends to start swiping together!</p>
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm border-4 border-white text-center space-y-6"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-aya-muted">Session Code</p>
            <p className="text-5xl font-black text-aya-secondary tracking-tight">{sessionCode}</p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleShare}
              className="flex-1 bg-aya-secondary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Share2 size={20} />
              Share Link
            </button>
          </div>
        </motion.div>

        <div className="w-full max-w-sm space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-aya-secondary">Sino'ng andito?</h3>
            <span className="bg-aya-primary/10 text-aya-primary text-[10px] font-black px-2 py-1 rounded-full">
                {participants.length} ACTIVE
            </span>
          </div>
          
          <div className="space-y-2">
              {participants.map((p) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/50 p-4 rounded-2xl border-2 border-dashed border-aya-muted/20 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-aya-primary text-white flex items-center justify-center font-black">
                      {p.display_name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="font-bold text-aya-secondary text-sm">
                        {p.id === participant?.id ? `You (${p.display_name})` : p.display_name}
                      </p>
                      <p className="text-aya-muted text-[10px] uppercase font-bold tracking-widest">
                        {p.is_done ? 'Done ✅' : 'Waiting...'}
                      </p>
                    </div>
                  </motion.div>
              ))}
          </div>

          <button 
            onClick={() => router.push('/solo')}
            className="w-full bg-white text-aya-secondary font-black py-4 rounded-2xl shadow-md border-2 border-transparent hover:border-aya-primary/20 transition-all flex items-center justify-center gap-2 group"
          >
            Start Swiping
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-[10px] text-aya-muted font-bold uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={12} />
          Results appear when everyone is done
        </p>
      </main>

      <BottomNav />
    </div>
  );
}

export default function BarkadaLobbyPage({ params }: { params: Promise<{ sessionCode: string }> }) {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-aya-bg gap-4">
                <Loader2 className="w-12 h-12 text-aya-primary animate-spin" />
            </div>
        }>
            <LobbyContent params={params} />
        </Suspense>
    );
}
