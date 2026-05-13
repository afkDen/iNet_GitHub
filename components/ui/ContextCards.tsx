'use client';

import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Option {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface ContextCardsProps {
  title: string;
  options: Option[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ContextCards({ title, options, selectedId, onSelect }: ContextCardsProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto p-4">
      <h2 className="text-2xl font-black text-aya-secondary mb-2">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option.id)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 text-center gap-2 min-h-[100px]",
              selectedId === option.id
                ? "border-aya-primary bg-white ring-2 ring-aya-primary/20 shadow-md"
                : "border-transparent bg-white shadow-sm hover:shadow-md"
            )}
          >
            {option.icon && (
              <div className={cn(
                "p-2 rounded-lg mb-1",
                selectedId === option.id ? "text-aya-primary" : "text-aya-muted"
              )}>
                {option.icon}
              </div>
            )}
            <span className={cn(
              "font-bold text-sm",
              selectedId === option.id ? "text-aya-primary" : "text-aya-secondary"
            )}>
              {option.label}
            </span>
            {option.description && (
              <span className="text-aya-muted text-[10px] leading-tight">
                {option.description}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
