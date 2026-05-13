'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ModeSelector from '@/components/ui/ModeSelector';
import ContextCards from '@/components/ui/ContextCards';
import { SessionMode, OutingType, BudgetTier } from '@/types';
import { Utensils, Beer, Palmtree, Clock, Wallet, Navigation } from 'lucide-react';
import { useSession } from '@/components/providers/SessionProvider';

const STEPS = ['mode', 'type', 'budget', 'distance'];

export default function OnboardingPage() {
  const router = useRouter();
  const { context, setContext, setSessionData, setParticipant } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLoading(true);
      try {
        const res = await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context })
        });
        const data = await res.json();
        
        if (data.session) {
          setSessionData(data.session);
          
          // Join session as host
          const joinRes = await fetch(`/api/session/${data.session.code}/join`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ nickname: 'Host' })
          });
          const joinData = await joinRes.json();
          if (joinData.participant) setParticipant(joinData.participant);
          
          if (context.mode === 'solo') {
            router.push('/solo');
          } else if (context.mode === 'barkada') {
            router.push('/barkada');
          } else {
            router.push('/lakbay');
          }
        }
      } catch (err) {
        console.error('Session creation failed:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (STEPS[currentStep]) {
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
      case 'type':
        return (
          <ContextCards
            title="Ano'ng plano?"
            selectedId={context.outing_type}
            onSelect={(id) => {
              setContext({ outing_type: id as OutingType });
              handleNext();
            }}
            options={[
              { id: 'food', label: 'Kain Tayo', icon: <Utensils /> },
              { id: 'activities', label: 'Gala / Activity', icon: <Palmtree /> },
              { id: 'explore', label: 'Drinks / Chill', icon: <Beer /> },
              { id: 'full_day', label: 'Full Day Outing', icon: <Clock /> },
            ]}
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
    <div className="flex flex-col flex-1 bg-aya-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <h1 className="text-3xl font-black text-aya-primary tracking-tighter italic">aya</h1>
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
      </div>

      <main className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
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
        {currentStep > 0 && (
          <button 
            onClick={handleBack}
            className="text-aya-muted font-bold text-sm hover:text-aya-secondary transition-colors"
          >
            ← Balik tayo
          </button>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
