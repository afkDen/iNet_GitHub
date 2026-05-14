'use client';

import { motion } from 'framer-motion';
import { User, Users, Map } from 'lucide-react';
import { SessionMode } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ModeOption {
  id: SessionMode;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const MODES: ModeOption[] = [
  {
    id: 'solo',
    title: 'Solo',
    description: 'Just me, myself, and my cravings.',
    icon: <User className="w-6 h-6" />,
    color: 'bg-aya-primary text-white',
  },
  {
    id: 'barkada',
    title: 'Barkada',
    description: 'Find a match with your friends.',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-aya-secondary text-white',
  },
];

interface ModeSelectorProps {
  selectedMode: SessionMode | null;
  onSelect: (mode: SessionMode) => void;
}

export default function ModeSelector({ selectedMode, onSelect }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-sm mx-auto p-4">
      <h2 className="text-2xl font-black text-aya-secondary mb-2">Pili ka ng trip:</h2>
      {MODES.map((mode) => (
        <motion.button
          key={mode.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(mode.id)}
          className={cn(
            "relative flex items-center p-4 rounded-2xl border-2 transition-all duration-200 text-left",
            selectedMode === mode.id 
              ? "border-aya-primary ring-2 ring-aya-primary/20 shadow-lg" 
              : "border-transparent bg-white shadow-sm hover:shadow-md"
          )}
        >
          <div className={cn("p-3 rounded-xl mr-4", mode.color)}>
            {mode.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-aya-secondary">{mode.title}</h3>
            <p className="text-aya-muted text-sm">{mode.description}</p>
          </div>
          {selectedMode === mode.id && (
            <motion.div 
              layoutId="active-mode"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-aya-primary"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
