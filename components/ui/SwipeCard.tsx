'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useState } from 'react';
import { Heart, X, RotateCcw, MapPin, Info, Utensils } from 'lucide-react';
import Image from 'next/image';

interface SwipeCardProps {
  establishment: any;
  onSwipe: (direction: 'left' | 'right', velocity: number, distance: number, hesitation: number) => void;
  isTop: boolean;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop";

export default function SwipeCard({ establishment, onSwipe, isTop }: SwipeCardProps) {
  const [imgError, setImgError] = useState(false);
  const [entryTime] = useState(Date.now());
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const yesOpacity = useTransform(x, [50, 150], [0, 1]);
  const noOpacity = useTransform(x, [-150, -50], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const velocity = Math.abs(info.velocity.x);
    const distance = Math.abs(info.offset.x);
    const hesitation = Date.now() - entryTime;
    
    if (info.offset.x > 100) {
      onSwipe('right', velocity, distance, hesitation);
    } else if (info.offset.x < -100) {
      onSwipe('left', velocity, distance, hesitation);
    }
  };

  const imgSrc = !establishment.photo || imgError ? FALLBACK_IMAGE : establishment.photo;

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute w-full max-w-[350px] aspect-[3/4] bg-white rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing border-4 border-white"
    >
      {/* Overlay Indicators */}
      <motion.div 
        style={{ opacity: yesOpacity }}
        className="absolute top-10 left-10 z-20 border-4 border-aya-swipe-yes px-4 py-2 rounded-xl rotate-[-20deg]"
      >
        <span className="text-aya-swipe-yes font-black text-3xl uppercase tracking-wider">G!</span>
      </motion.div>

      <motion.div 
        style={{ opacity: noOpacity }}
        className="absolute top-10 right-10 z-20 border-4 border-aya-swipe-no px-4 py-2 rounded-xl rotate-[20deg]"
      >
        <span className="text-aya-swipe-no font-black text-3xl uppercase tracking-wider">PASS</span>
      </motion.div>

      {/* Image Section */}
      <div className="relative w-full h-3/5 bg-aya-bg">
        {imgSrc && (
          <Image 
            src={imgSrc} 
            alt={establishment.name}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            unoptimized={imgError} // Prevent infinite loop if fallback fails
          />
        )}
        {!imgSrc && (
          <div className="w-full h-full flex items-center justify-center text-aya-muted">
            <Utensils size={48} opacity={0.2} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {establishment.is_deal && (
            <div className="bg-aya-deal text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1 shadow-md">
              <span className="animate-pulse">🔥</span> {establishment.deal_text}
            </div>
          )}
          {establishment.is_community_pin && (
            <div className="bg-aya-community text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1 shadow-md ml-auto">
              📍 Local Pick
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-1 text-xs font-medium opacity-90">
            <span>{establishment.category}</span>
            <span>•</span>
            <span>{establishment.city}</span>
          </div>
          <h3 className="text-2xl font-black leading-tight tracking-tight">{establishment.name}</h3>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-bold text-aya-secondary">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-aya-primary" />
            <span>{establishment.dist}</span>
          </div>
          <div className="text-aya-muted">{establishment.cost}</div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-aya-swipe-yes" />
            <span>{establishment.status}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {establishment.tags.map((tag: string) => (
            <span 
              key={tag} 
              className="bg-aya-bg text-aya-muted text-[10px] font-bold px-2 py-1 rounded-lg border border-aya-muted/20"
            >
              #{tag}
            </span>
          ))}
        </div>

        {establishment.is_community_pin && (
          <p className="text-[10px] text-aya-muted italic bg-aya-bg/50 p-2 rounded-lg border-l-2 border-aya-community">
            "{establishment.community_confirms} locals confirmed · Unli rice until 3PM today"
          </p>
        )}
      </div>
    </motion.div>
  );
}
