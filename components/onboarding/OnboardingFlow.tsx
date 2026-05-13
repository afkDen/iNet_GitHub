'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ModeSelector from '@/components/ui/ModeSelector';
import ContextCards from '@/components/ui/ContextCards';
import { SessionMode, BudgetTier } from '@/types';
import { Wallet, Navigation } from 'lucide-react';
import { useSession } from '@/components/providers/SessionProvider';

const STEPS = ['mode', 'budget', 'distance'];

interface OnboardingFlowProps {
  onBack: () => void;
}

export default function OnboardingFlow({ onBack }: OnboardingFlowProps) {
  const router = useRouter();
  const { context, setContext } = useSession();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalize and go to swipe
      if (context.mode === 'solo') {
        router.push('/solo');
      } else if (context.mode === 'barkada') {
        router.push('/barkada');
      } else {
        router.push('/lakbay');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
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
    <div className="flex flex-col flex-1 w-full">
      {/* Progress indicators moved here to keep it self-contained */}
      <div className="flex gap-1 mb-4 justify-center">
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
        <button 
          onClick={handleBack}
          className="text-aya-muted font-bold text-sm hover:text-aya-secondary transition-colors"
        >
          ← Balik tayo
        </button>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
