'use client';

import { Establishment } from '@/types';
import { MapPin, Clock, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface EstablishmentCardProps {
  establishment: Establishment;
  onClick?: () => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop";

export default function EstablishmentCard({ establishment, onClick }: EstablishmentCardProps) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = !establishment.photo_url || imgError ? FALLBACK_IMAGE : establishment.photo_url;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-aya-muted/10 overflow-hidden hover:shadow-md transition-all h-full flex flex-col cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="relative h-48 w-full bg-aya-bg">
        <Image 
          src={imgSrc} 
          alt={establishment.name}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm text-aya-secondary text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            {establishment.category}
          </div>
        </div>
        {establishment.is_deal && (
          <div className="absolute bottom-3 left-3 bg-aya-deal text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase shadow-sm">
            🔥 {establishment.deal_text}
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div>
          <h3 className="text-lg font-black text-aya-secondary leading-tight line-clamp-1">
            {establishment.name}
          </h3>
          <p className="text-xs text-aya-muted flex items-center gap-1 mt-1">
            <MapPin size={12} />
            {establishment.address}, {establishment.city}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-aya-bg mt-auto">
          <div className="flex items-center gap-1 text-xs font-bold text-aya-primary">
            <Wallet size={14} />
            <span>₱{establishment.cost_min} - ₱{establishment.cost_max}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-aya-muted">
            <Clock size={12} />
            <span>{establishment.opens_at} - {establishment.closes_at}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {establishment.vibe_tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="bg-aya-bg text-aya-muted text-[10px] font-bold px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
