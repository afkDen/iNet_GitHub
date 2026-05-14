'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SwipeCard from './SwipeCard';
import { X, Heart, RotateCcw } from 'lucide-react';

interface SwipeDeckProps {
  items: any[];
  onSwipe?: (item: any, direction: 'left' | 'right', velocity: number, distance: number, hesitation: number) => void;
  onFinish: () => void;
}

export default function SwipeDeck({ items, onFinish, onSwipe }: SwipeDeckProps) {
  const [stack, setStack] = useState(items);
  const [history, setHistory] = useState<any[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);

  // Update stack when items prop changes (e.g. after API fetch)
  useEffect(() => {
    setStack(items);
  }, [items]);

  const handleSwipe = useCallback(async (direction: 'left' | 'right', velocity: number = 500, distance: number = 150, hesitation: number = 1000) => {
    const swipedItem = stack[0];
    if (!swipedItem) return;

    // 1. Notify parent immediately for sync
    if (onSwipe) {
        onSwipe(swipedItem, direction, velocity, distance, hesitation);
    }

    // 2. Manage local history for undo
    setHistory(prev => [swipedItem, ...prev]);

    // 3. Update stack
    const newStack = stack.slice(1);
    setStack(newStack);

    // 4. Check if finished
    if (newStack.length === 0) {
        setIsFinishing(true);
        // Small delay to let the exit animation complete before triggering navigation
        setTimeout(() => {
            onFinish();
        }, 500);
    }
  }, [stack, onSwipe, onFinish]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastItem = history[0];
    setStack(prev => [lastItem, ...prev]);
    setHistory(prev => prev.slice(1));
    setIsFinishing(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto p-4">
      {/* The Stack */}
      <div className="relative w-full aspect-[3/4] flex justify-center items-center">
        {isFinishing ? (
            <div className="flex flex-col items-center gap-4 text-center p-8 bg-white/50 rounded-3xl border-2 border-dashed border-aya-primary/30">
                <Loader2 className="w-10 h-10 text-aya-primary animate-spin" />
                <p className="text-aya-secondary font-black italic">Hinahanda na ni Aya ang resulta...</p>
            </div>
        ) : (
            <>
                <AnimatePresence>
                {stack.slice(0, 2).reverse().map((item, index) => (
                    <SwipeCard
                    key={item.id}
                    establishment={item}
                    onSwipe={handleSwipe}
                    isTop={index === 1 || stack.length === 1}
                    />
                ))}
                </AnimatePresence>
                
                {stack.length === 0 && (
                <div className="text-center p-8 bg-white/50 rounded-3xl border-2 border-dashed border-aya-muted/30">
                    <p className="text-aya-muted font-bold italic">Wala na tayong options, beh.</p>
                </div>
                )}
            </>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => handleSwipe('left', 200, 100, 800)}
          disabled={stack.length === 0 || isFinishing}
          className="p-4 rounded-full bg-white shadow-lg text-aya-swipe-no hover:scale-110 active:scale-90 transition-transform disabled:opacity-50"
        >
          <X size={32} strokeWidth={3} />
        </button>

        <button 
          onClick={handleUndo}
          disabled={history.length === 0 || isFinishing}
          className="p-3 rounded-full bg-white shadow-md text-aya-muted hover:scale-110 active:scale-90 transition-transform disabled:opacity-50"
        >
          <RotateCcw size={20} strokeWidth={2.5} />
        </button>

        <button 
          onClick={() => handleSwipe('right', 800, 200, 800)}
          disabled={stack.length === 0 || isFinishing}
          className="p-4 rounded-full bg-aya-primary shadow-lg text-white hover:scale-110 active:scale-90 transition-transform disabled:opacity-50"
        >
          <Heart size={32} fill="white" />
        </button>
      </div>

      <div className="text-aya-muted text-xs font-bold uppercase tracking-widest">
        {stack.length > 0 ? `Card ${items.length - stack.length + 1} of ${items.length}` : "Finished!"}
      </div>
    </div>
  );
}

import { Loader2 } from 'lucide-react';
