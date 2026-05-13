'use client';

import { History, Calendar, Star, ArrowRight } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';

const MOCK_HISTORY = [
  { id: '1', name: "Ate Nena's Kitchen", date: 'May 10, 2026', mode: 'Solo', rating: 5 },
  { id: '2', name: "Lito's Brew & Bites", date: 'May 08, 2026', mode: 'Barkada', rating: 4 },
];

export default function HistoryPage() {
  return (
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen pb-24">
      <header className="p-6">
        <h1 className="text-3xl font-black text-aya-primary tracking-tighter italic">aya</h1>
      </header>

      <main className="flex-1 flex flex-col p-6 gap-6 max-w-sm mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="bg-white w-12 h-12 rounded-full shadow-md flex items-center justify-center border border-aya-muted/10">
            <History className="text-aya-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-aya-secondary leading-tight">History</h2>
            <p className="text-aya-muted text-[10px] font-bold uppercase tracking-widest">Your past outings</p>
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_HISTORY.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-white flex justify-between items-center group">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-aya-primary bg-aya-primary/10 px-2 py-0.5 rounded-full">
                    {item.mode}
                  </span>
                  <div className="flex text-aya-deal">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={10} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <h3 className="font-bold text-aya-secondary">{item.name}</h3>
                <div className="flex items-center gap-1.5 text-aya-muted text-[10px] font-bold">
                  <Calendar size={12} />
                  <span>{item.date}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-aya-bg flex items-center justify-center text-aya-muted group-hover:bg-aya-primary group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </div>
            </div>
          ))}

          <div className="p-8 text-center border-2 border-dashed border-aya-muted/20 rounded-3xl">
            <p className="text-aya-muted text-sm font-bold italic">Wala na munang ibang gala?</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
