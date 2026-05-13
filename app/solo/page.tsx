'use client';

import { useRouter } from 'next/navigation';
import SwipeDeck from '@/components/ui/SwipeDeck';
import BottomNav from '@/components/ui/BottomNav';
import { MOCK_ESTABLISHMENTS } from '@/lib/data/mock';
import { useSession } from '@/components/providers/SessionProvider';

export default function SoloSwipePage() {
  const router = useRouter();
  const { context } = useSession();

  const handleFinish = (results: any[]) => {
    console.log('Swipe results:', results);
    // In a real app, we'd save this to a session
    router.push('/reveal');
  };

  // Filter establishments based on context (Budget tier)
  const filteredItems = MOCK_ESTABLISHMENTS.filter(item => {
    if (context.budget === 'tipid') return item.cost === '₱' || item.cost === '₱₱';
    if (context.budget === 'mid') return item.cost === '₱₱' || item.cost === '₱₱₱';
    return true; // bahala_na includes everything
  });

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
        <SwipeDeck 
          items={filteredItems.length > 0 ? filteredItems : MOCK_ESTABLISHMENTS} 
          onFinish={handleFinish} 
        />
      </main>

      <BottomNav />
    </div>
  );
}
