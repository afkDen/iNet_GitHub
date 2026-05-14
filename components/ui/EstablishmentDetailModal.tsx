'use client';

import { Establishment } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Wallet, Info, Star, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface EstablishmentDetailModalProps {
  establishment: Establishment | null;
  onClose: () => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop";

export default function EstablishmentDetailModal({ establishment, onClose }: EstablishmentDetailModalProps) {
  const [imgError, setImgError] = useState(false);
  
  if (!establishment) return null;

  const imgSrc = !establishment.photo_url || imgError ? FALLBACK_IMAGE : establishment.photo_url;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-aya-bg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <X size={20} />
          </button>

          {/* Image Header */}
          <div className="relative h-64 w-full flex-shrink-0">
            <Image 
              src={imgSrc} 
              alt={establishment.name}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="bg-aya-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase inline-block mb-2">
                    {establishment.category}
                </div>
                <h2 className="text-3xl font-black tracking-tight leading-tight">{establishment.name}</h2>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-aya-muted/10">
                    <div className="flex items-center gap-2 text-aya-primary mb-1">
                        <Wallet size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Estimated Cost</span>
                    </div>
                    <p className="font-black text-aya-secondary">₱{establishment.cost_min} - ₱{establishment.cost_max}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-aya-muted/10">
                    <div className="flex items-center gap-2 text-aya-primary mb-1">
                        <Clock size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Hours Today</span>
                    </div>
                    <p className="font-black text-aya-secondary">{establishment.opens_at} - {establishment.closes_at}</p>
                </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-aya-muted">
                    <MapPin size={18} />
                    <span className="text-sm font-bold">Location</span>
                </div>
                <p className="text-aya-secondary font-medium pl-6">
                    {establishment.address}, {establishment.city}
                </p>
            </div>

            {/* Vibe Tags */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-aya-muted">
                    <Star size={18} />
                    <span className="text-sm font-bold">The Vibe</span>
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
                    {establishment.vibe_tags.map((tag) => (
                        <span 
                            key={tag} 
                            className="bg-white text-aya-muted text-xs font-bold px-3 py-1.5 rounded-xl border border-aya-muted/10"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Community Section */}
            {(establishment.is_community_pin || establishment.is_deal) && (
                <div className="bg-white rounded-2xl p-4 border-2 border-aya-primary/10 space-y-3">
                    {establishment.is_deal && (
                        <div className="flex items-start gap-3">
                            <div className="bg-aya-deal/10 p-2 rounded-lg text-aya-deal">
                                <Info size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-aya-deal uppercase">Exclusive Deal</p>
                                <p className="text-sm font-bold text-aya-secondary">{establishment.deal_text}</p>
                            </div>
                        </div>
                    )}
                    {establishment.is_community_pin && (
                        <div className="flex items-start gap-3">
                            <div className="bg-aya-community/10 p-2 rounded-lg text-aya-community">
                                <Star size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-aya-community uppercase">Community Trusted</p>
                                <p className="text-sm font-bold text-aya-secondary">
                                    {establishment.community_confirms} local explorers verified this spot.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-white border-t border-aya-bg flex gap-3">
            <button className="flex-1 bg-aya-primary text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Get Directions
            </button>
            <button className="p-4 bg-aya-bg text-aya-secondary rounded-2xl hover:bg-aya-muted/10 transition-colors">
                <Share2 size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
