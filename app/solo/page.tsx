'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SwipeDeck from '@/components/ui/SwipeDeck';
import BottomNav from '@/components/ui/BottomNav';
import { useSession } from '@/components/providers/SessionProvider';
import { Establishment } from '@/types';

export default function SoloSwipePage() {
  const router = useRouter();
  const { context, sessionData, participant } = useSession();
  const [stack, setStack] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStack() {
      if (!sessionData?.code) {
        // If no session, go back to onboarding
        router.replace('/onboarding');
        return;
      }

      try {
        const res = await fetch(`/api/session/${sessionData.code}`);
        const data = await res.json();
        
        if (data.cardStack) {
          // Map backend Establishment to UI format
          const mapped = data.cardStack.map((e: Establishment) => ({
            ...e,
            photo: e.photo_url,
            dist: '0.8 km', // Placeholder for now
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

  const handleFinish = async (results: any[]) => {
    if (!sessionData || !participant) return;

    // Record all swipes in the backend
    try {
      await Promise.all(results.map(res => 
        fetch('/api/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionData.id,
            participant_id: participant.id,
            establishment_id: res.id,
            direction: res.direction,
            speed_ms: 500, // Placeholder enthusiasm speed
            drag_distance: res.distance
          })
        })
      ));

      // Mark participant as done
      await fetch(`/api/participants/${participant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done' })
      });

      router.push('/reveal');
    } catch (err) {
      console.error('Failed to record results:', err);
      router.push('/reveal'); // Go anyway for demo
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen pb-24">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-aya-secondary tracking-tight">Hain ni Aya</h1>
          <p className="text-aya-muted text-xs font-bold uppercase tracking-widest">
            {context.mode} Mode • {context.outing_type}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-aya-muted/10">
          <span className="text-lg">🔥</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {loading ? (
          <div className="text-aya-muted font-bold animate-pulse">Hinahanda ni Aya...</div>
        ) : (
          <SwipeDeck 
            items={stack} 
            onFinish={handleFinish} 
          />
        )}
      </main>

      <BottomNav />
    </div>
  );
}
