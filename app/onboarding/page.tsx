'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ModeSelector from '@/components/ui/ModeSelector';
import ContextCards from '@/components/ui/ContextCards';
import EstablishmentCard from '@/components/ui/EstablishmentCard';
import EstablishmentDetailModal from '@/components/ui/EstablishmentDetailModal';
import { establishments } from '@/lib/data/establishments';
import { SessionMode, OutingType, BudgetTier, Establishment } from '@/types';
import { Utensils, Beer, Palmtree, Clock, Wallet, Navigation, Search, Sparkles, Loader2, Users, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import { useSession } from '@/components/providers/SessionProvider';
function OnboardingFlow() {
  const STEPS = ['type', 'mode', 'budget', 'distance'];
  const router = useRouter();
  const searchParams = useSearchParams();
  const { context, setContext, setSessionData, setParticipant } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [joinCode, setJoinCode] = useState(searchParams.get('join') || '');
  const [isJoining, setIsJoining] = useState(!!searchParams.get('join'));
  const [isExploring, setIsExploring] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);

  const finalizeSession = async (customContext = context) => {
    setLoading(true);
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: customContext })
      });
      const data = await res.json();
      
      if (data.session) {
        setSessionData(data.session);
        
        const joinRes = await fetch(`/api/session/${data.session.code}/join`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ nickname: 'Host' })
        });
        const joinData = await joinRes.json();
        if (joinData.participant) setParticipant(joinData.participant);
        
        if (customContext.mode === 'solo') {
          router.push('/solo');
        } else if (customContext.mode === 'barkada') {
          router.push(`/barkada/${data.session.code}/lobby`);
        } else {
          router.push('/lakbay');
        }
      }
    } catch (err) {
      console.error('Session creation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!joinCode.trim()) return;

      setLoading(true);
      try {
          const res = await fetch(`/api/session/${joinCode.trim()}/join`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nickname: 'Friend' })
          });
          const data = await res.json();
          if (data.participant) {
              setParticipant(data.participant);
              // Fetch session data to sync
              const sessRes = await fetch(`/api/session/${joinCode.trim()}`);
              const sessData = await sessRes.json();
              if (sessData.session) setSessionData(sessData.session);
              
              router.push(`/barkada/${joinCode.trim()}/lobby`);
          } else {
              alert('Session not found or error joining.');
          }
      } catch (err) {
          console.error('Join failed:', err);
      } finally {
          setLoading(false);
      }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finalizeSession();
    }
  };

  const handleSurprise = () => {
    const surpriseContext = {
      ...context,
      mode: 'solo' as SessionMode,
      budget: ['tipid', 'mid', 'bahala_na'][Math.floor(Math.random() * 3)] as BudgetTier,
      outing_type: 'food' as OutingType,
      distance_km: 10
    };
    setContext(surpriseContext);
    finalizeSession(surpriseContext);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: searchText, base: context })
      });
      const data = await res.json();
      if (data.context) {
        setContext(data.context);
        handleNext();
      }
    } catch (err) {
      console.error('NLP Parse failed:', err);
      handleNext();
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (isExploring) {
        setIsExploring(false);
    } else if (context.mode === 'lakbay' && currentStep === 2) {
      setCurrentStep(0);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (isJoining) {
        setIsJoining(false);
    }
  };

  const renderStep = () => {
    if (isJoining) {
        return (
            <div className="space-y-8 w-full max-w-sm mx-auto p-4">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-aya-secondary leading-tight tracking-tight">Sumali sa Barkada</h2>
                    <p className="text-aya-muted font-bold text-sm">Enter the code shared by your friend.</p>
                </div>
                <form onSubmit={handleJoinSession} className="space-y-4">
                    <input 
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        placeholder="AYA-XXXX"
                        className="w-full bg-white py-6 text-center text-3xl font-mono tracking-widest rounded-2xl shadow-sm border-2 border-transparent focus:border-aya-primary transition-all text-aya-secondary uppercase"
                    />
                    <button 
                        type="submit"
                        className="w-full bg-aya-primary text-white text-xl font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        Sumali Na!
                        <ArrowRight />
                    </button>
                </form>
            </div>
        );
    }

    if (isExploring) {
      return (
        <div className="w-full max-w-6xl mx-auto p-4 h-[75vh] overflow-y-auto">
          <div className="space-y-2 mb-8 px-2">
            <h2 className="text-4xl font-black text-aya-secondary leading-tight tracking-tight">Explore the Vibes</h2>
            <p className="text-aya-muted font-bold text-sm">Sali ka na sa experience! Here are the hottest spots today.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 pb-20">
            {establishments
              .sort((a, b) => a.cost_min - b.cost_min)
              .map(est => (
                <EstablishmentCard 
                    key={est.id} 
                    establishment={est} 
                    onClick={() => setSelectedEstablishment(est)}
                />
              ))}
          </div>
        </div>
      );
    }

    switch (STEPS[currentStep]) {
      case 'type':
        return (
          <div className="space-y-8 w-full max-w-sm mx-auto p-4">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-aya-secondary leading-tight tracking-tight">Where are you headed today?</h2>
              <p className="text-aya-muted font-bold text-sm">Pick your outing type to start.</p>
            </div>

            <ContextCards
              title=""
              selectedId={context.outing_type}
              onSelect={(id) => {
                if (id === 'join') {
                    setIsJoining(true);
                } else if (id === 'full_day') {
                    setContext({ outing_type: 'full_day', mode: 'lakbay' });
                    setCurrentStep(2); // Skip 'mode' step (index 1) and go to 'budget' (index 2)
                } else if (id === 'explore') {
                    setIsExploring(true);
                } else {
                    setContext({ outing_type: id as OutingType });
                    handleNext();
                }
              }}
              options={[
                { id: 'food', label: 'Food & Drinks', icon: <Utensils /> },
                { id: 'join', label: 'Sumali na', icon: <Users className="text-aya-primary" /> },
                { id: 'explore', label: 'Explore', icon: <Beer /> },
                { id: 'full_day', label: 'Lakbay', icon: <Clock /> },
              ]}
            />

            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-aya-muted group-focus-within:text-aya-primary transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Or just type it out... 'Budget na dinner'"
                className="w-full bg-white py-5 pl-12 pr-4 rounded-2xl shadow-sm border-2 border-transparent focus:border-aya-primary/20 focus:ring-0 transition-all font-bold text-aya-secondary"
              />
            </form>

            <button 
              onClick={handleSurprise}
              className="w-full py-4 text-aya-muted font-black text-xs uppercase tracking-[0.2em] hover:text-aya-primary transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              Surprise Me — skip all this
            </button>
            <button 
              onClick={() => router.push('/pin')}
              className="w-full py-4 text-aya-muted font-black text-xs uppercase tracking-[0.2em] hover:text-aya-primary transition-colors flex items-center justify-center gap-2"
            >
              <MapPin size={14} />
              More Options
            </button>
          </div>
        );
      case 'mode':
        return (
          <ModeSelector 
            selectedMode={context.mode} 
            onSelect={(mode) => {
              setContext({ mode });
              handleNext();
            }} 
          />
        );
      case 'budget':
        return (
          <ContextCards
            title="Magkano budget?"
            selectedId={context.budget}
            onSelect={(id) => {
              setContext({ budget: id as BudgetTier });
              handleNext();
            }}
            options={[
              { id: 'tipid', label: 'Grabe Tipid', description: '₱150 pababa', icon: <Wallet className="text-green-600" /> },
              { id: 'mid', label: 'Sakto Lang', description: '₱150 - ₱350', icon: <Wallet className="text-aya-primary" /> },
              { id: 'bahala_na', label: 'Bahala Na', description: '₱350 pataas', icon: <Wallet className="text-purple-600" /> },
            ]}
          />
        );
      case 'distance':
        return (
          <ContextCards
            title="Gaano kalayo?"
            selectedId={context.distance_km?.toString() || '5'}
            onSelect={(id) => {
              setContext({ distance_km: parseInt(id) });
              handleNext();
            }}
            options={[
              { id: '1', label: 'Malapit Lang', description: '1 km', icon: <Navigation className="w-4 h-4" /> },
              { id: '3', label: 'Keri Pa', description: '3 km', icon: <Navigation className="w-5 h-5" /> },
              { id: '5', label: 'Layo Konti', description: '5 km', icon: <Navigation className="w-6 h-6" /> },
              { id: '10', label: 'Dayo Level', description: '10 km+', icon: <Navigation className="w-7 h-7" /> },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-50 bg-aya-bg/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-aya-primary animate-spin" />
          <p className="text-aya-secondary font-black text-xl animate-pulse italic">Hinahanap ni Aya...</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
            {isExploring && (
                <button 
                    onClick={() => setIsExploring(false)}
                    className="p-2 -ml-2 text-aya-muted hover:text-aya-primary transition-colors rounded-full hover:bg-aya-primary/5"
                >
                    <ArrowLeft size={24} />
                </button>
            )}
            <Link href="/">
              <h1 className="text-3xl font-black text-aya-primary tracking-tighter italic cursor-pointer">aya</h1>
            </Link>
        </div>
        {!isJoining && !isExploring && (
            <div className="flex gap-1">
            {STEPS.map((_, i) => (
                <div 
                key={i} 
                className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === currentStep ? "w-6 bg-aya-primary" : "w-1.5 bg-aya-muted/30"
                )}
                />
            ))}
            </div>
        )}
      </div>

      <main className={cn("flex-1 flex flex-col", isExploring ? "items-start justify-start" : "items-center justify-center")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isJoining ? 'joining' : currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Back button */}
      <div className="p-8 flex justify-center">
        {(currentStep > 0 || isJoining) && (
          <button 
            onClick={handleBack}
            className="text-aya-muted font-bold text-sm hover:text-aya-secondary transition-colors"
          >
            ← Balik tayo
          </button>
        )}
      </div>

      <EstablishmentDetailModal 
        establishment={selectedEstablishment} 
        onClose={() => setSelectedEstablishment(null)} 
      />
    </div>
  );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-aya-bg gap-4">
                <Loader2 className="w-12 h-12 text-aya-primary animate-spin" />
            </div>
        }>
            <OnboardingFlow />
        </Suspense>
    );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
