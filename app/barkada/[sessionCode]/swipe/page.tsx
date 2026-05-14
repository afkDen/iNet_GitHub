'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import SwipeDeck from '@/components/ui/SwipeDeck';
import BottomNav from '@/components/ui/BottomNav';
import { useSession } from '@/components/providers/SessionProvider';
import { Establishment } from '@/types';
import { Loader2, Users } from 'lucide-react';

export default function BarkadaSwipePage({ params }: { params: Promise<{ sessionCode: string }> }) {
  const router = useRouter();
  const { sessionCode } = use(params);
  const { sessionData, participant } = useSession();
  const [stack, setStack] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStack() {
      if (!sessionData?.code) {
        router.replace('/onboarding');
        return;
      }

      try {
        const res = await fetch(`/api/session/${sessionData.code}`);
        const data = await res.json();
        
        if (data.cardStack) {
          const mapped = data.cardStack.map((e: Establishment) => ({
            ...e,
            photo: e.photo_url,
            dist: '0.8 km',
            cost: `₱${e.cost_min} - ₱${e.cost_max}`,
            status: e.is_open ? 'Open' : 'Closed',
            tags: e.vibe_tags
          }));
          setStack(mapped);
        }
      } catch (err) {
        console.error('Failed to load card stack:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStack();
  }, [sessionData, router]);

  const handleSwipeSync = async (item: any, direction: 'left' | 'right', velocity: number, distance: number, hesitation: number) => {
    if (!sessionData || !participant) return;

    try {
        await fetch('/api/swipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionData.id,
              participant_id: participant.id,
              establishment_id: item.id,
              direction: direction,
              speed_ms: Math.round(velocity),
              hesitation_ms: Math.round(hesitation),
              drag_distance: Math.round(distance)
            })
        });
    } catch (err) {
        console.error('Failed to sync swipe:', err);
    }
  };

  const handleFinish = async () => {
    if (!participant) {
        router.push(`/barkada/${sessionCode}/reveal`);
        return;
    }

    try {
      await fetch(`/api/participants/${participant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done' })
      });

      router.push(`/barkada/${sessionCode}/reveal`);
    } catch (err) {
      console.error('Failed to finish session:', err);
      router.push(`/barkada/${sessionCode}/reveal`);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen pb-24">
      <header className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-aya-secondary tracking-tight italic">aya</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-aya-secondary text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Barkada Mode</span>
            <span className="text-aya-muted text-[10px] font-bold">{sessionCode}</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-aya-muted/10">
          <Users size={20} className="text-aya-primary" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-aya-primary animate-spin" />
            <p className="text-aya-muted font-bold animate-pulse italic">Hinahanda ni Aya...</p>
          </div>
        ) : (
          <SwipeDeck 
            items={stack} 
            onSwipe={handleSwipeSync}
            onFinish={handleFinish} 
          />
        )}
      </main>

      <BottomNav />
    </div>
  );
}
