'use client';

import { Camera, MapPin, Sparkles } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';

export default function PinPage() {
  return (
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen pb-24">
      <header className="p-6">
        <h1 className="text-3xl font-black text-aya-primary tracking-tighter italic">aya</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <div className="text-center space-y-2">
          <div className="bg-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center mx-auto border-2 border-aya-primary/20 mb-4">
            <MapPin className="text-aya-primary w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-aya-secondary">Drop a Pin</h2>
          <p className="text-aya-muted text-sm max-w-[250px]">Found a hidden gem? Share it with the community!</p>
        </div>

        <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-xl space-y-6">
          <div className="aspect-video bg-aya-bg rounded-2xl border-2 border-dashed border-aya-muted/20 flex flex-col items-center justify-center gap-2 text-aya-muted">
            <Camera size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-aya-muted px-1">Place Name</label>
              <input 
                type="text" 
                placeholder="Ano'ng pangalan nito?" 
                className="w-full bg-aya-bg p-4 rounded-xl border-none focus:ring-2 focus:ring-aya-primary transition-all font-bold text-aya-secondary"
              />
            </div>
          </div>

          <button className="w-full bg-aya-primary text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">
            Submit for Review
          </button>
        </div>

        <p className="text-[10px] text-aya-muted font-bold uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={12} />
          Community pins get verified by Aya
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
