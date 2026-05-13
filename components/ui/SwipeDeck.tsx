'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import SwipeCard from './SwipeCard';
import { X, Heart, RotateCcw } from 'lucide-react';

interface SwipeDeckProps {
  items: any[];
  onFinish: (results: any[]) => void;
}

export default function SwipeDeck({ items, onFinish }: SwipeDeckProps) {
  const [stack, setStack] = useState(items);
  const [history, setHistory] = useState<any[]>([]);
  const [results, setResults] = useState<{ id: string; direction: 'left' | 'right' }[]>([]);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const swipedItem = stack[0];
    if (!swipedItem) return;

    setResults(prev => [...prev, { id: swipedItem.id, direction }]);
    setHistory(prev => [swipedItem, ...prev]);
    setStack(prev => prev.slice(1));

    if (stack.length === 1) {
      onFinish([...results, { id: swipedItem.id, direction }]);
    }
  }, [stack, results, onFinish]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastItem = history[0];
    setStack(prev => [lastItem, ...prev]);
    setHistory(prev => prev.slice(1));
    setResults(prev => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto p-4">
      {/* The Stack */}
      <div className="relative w-full aspect-[3/4] flex justify-center items-center">
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
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => handleSwipe('left')}
          disabled={stack.length === 0}
          className="p-4 rounded-full bg-white shadow-lg text-aya-swipe-no hover:scale-110 active:scale-90 transition-transform disabled:opacity-50"
        >
          <X size={32} strokeWidth={3} />
        </button>

        <button 
          onClick={handleUndo}
          disabled={history.length === 0}
          className="p-3 rounded-full bg-white shadow-md text-aya-muted hover:scale-110 active:scale-90 transition-transform disabled:opacity-50"
        >
          <RotateCcw size={20} strokeWidth={2.5} />
        </button>

        <button 
          onClick={() => handleSwipe('right')}
          disabled={stack.length === 0}
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
