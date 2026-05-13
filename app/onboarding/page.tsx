'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/SessionProvider';
import { OutingType } from '@/types';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'food', label: 'Food & Drinks', icon: '🍲', description: 'Kain tayo!' },
  { id: 'activities', label: 'Activities', icon: '🏛️', description: 'Gala / Activity' },
  { id: 'explore', label: 'Explore', icon: '🕒', description: 'Drinks / Chill' },
  { id: 'full_day', label: 'Full Day', icon: '📈', description: 'Full day outing' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { context, setContext } = useSession();
  const [showFlow, setShowFlow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<OutingType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNext = () => {
    if (selectedCategory === 'food') {
      setContext({ outing_type: 'food' });
      setShowFlow(true);
    } else if (selectedCategory) {
      // For now, other categories go to lakbay flow as indicated in frontendupdate.md
      setContext({ outing_type: selectedCategory as OutingType });
      router.push('/lakbay');
    } else if (searchQuery) {
      // If search query is provided, we could potentially route to a search results or AI processing
      setContext({ natural_language: searchQuery });
      // Default to food for now or go to lakbay
      router.push('/lakbay');
    }
  };

  const handleSurpriseMe = () => {
    setContext({ mode: 'solo', outing_type: 'food' });
    router.push('/solo');
  };

  if (showFlow) {
    return (
      <div className="flex flex-col flex-1 bg-aya-bg min-h-screen">
        <header className="p-6">
          <h1 className="text-3xl font-black text-aya-primary tracking-tighter italic">aya</h1>
        </header>
        <OnboardingFlow onBack={() => setShowFlow(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen p-6">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-aya-primary tracking-tighter italic">aya</h1>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full flex flex-col">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-aya-secondary leading-tight mb-2">
            Where are you headed today?
          </h2>
          <p className="text-aya-muted font-medium">
            Pick your outing type to start.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as OutingType)}
              className={cn(
                "flex flex-col items-start p-4 rounded-3xl border-2 transition-all duration-200 text-left gap-3 h-32 relative overflow-hidden",
                selectedCategory === cat.id
                  ? "border-aya-primary bg-white shadow-lg ring-1 ring-aya-primary"
                  : "border-transparent bg-white shadow-sm hover:shadow-md"
              )}
            >
              <span className="text-3xl">{cat.icon}</span>
              <div className="flex flex-col">
                <span className={cn(
                  "font-bold text-lg leading-tight",
                  selectedCategory === cat.id ? "text-aya-primary" : "text-aya-secondary"
                )}>
                  {cat.label}
                </span>
              </div>
              {selectedCategory === cat.id && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-aya-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-aya-muted" />
          </div>
          <input
            type="text"
            placeholder='Or just type it out "Budget-friendly na..."'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-transparent focus:border-aya-primary/30 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none transition-all placeholder:text-aya-muted/60 font-medium"
          />
        </div>

        <div className="mt-auto">
          {/* Action Button */}
          <button
            onClick={handleNext}
            disabled={!selectedCategory && !searchQuery}
            className={cn(
              "w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all duration-300 mb-6",
              (selectedCategory || searchQuery)
                ? "bg-aya-primary text-white shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                : "bg-aya-muted/20 text-aya-muted/50 cursor-not-allowed"
            )}
          >
            Next <ArrowRight className="w-6 h-6" />
          </button>

          {/* Surprise Me */}
          <button
            onClick={handleSurpriseMe}
            className="w-full text-aya-muted font-bold flex items-center justify-center gap-2 hover:text-aya-primary transition-colors py-2"
          >
            <Sparkles className="w-4 h-4" /> Surprise Me — skip all this
          </button>
        </div>
      </main>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
