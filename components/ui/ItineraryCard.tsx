'use client';

import { motion } from 'framer-motion';
import { Itinerary } from '@/types';
import { MapPin, Clock, Wallet, ArrowRight } from 'lucide-react';

interface ItineraryCardProps {
    itinerary: Itinerary;
    onAccept: () => void;
    onSkip: () => void;
    isAccepted?: boolean;
}

export default function ItineraryCard({
    itinerary,
    onAccept,
    onSkip,
    isAccepted = false
}: ItineraryCardProps) {
    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="aya-card w-full max-w-[375px] mx-auto bg-white border border-[#E8E5DF] flex flex-col"
        >
            {/* Top Header */}
            <div className="px-6 pt-6 pb-3">
                <p className="text-[11px] uppercase tracking-wider text-[#6B6B6B] font-semibold">
                    Est. total: ~₱{itinerary.total_cost_per_head}/head · About {itinerary.total_hours} hrs
                </p>
            </div>

            {/* Map Thumbnail (Smoke & Mirrors) */}
            <div className="px-6 mb-6">
                <div className="w-full h-40 bg-[#F5F3EF] rounded-2xl border border-[#E8E5DF] relative overflow-hidden flex items-center justify-center">
                    <svg width="200" height="100" viewBox="0 0 200 100" className="text-[#E85D26]">
                        {/* Route Line */}
                        <path
                            d="M 40 60 L 100 40 L 160 70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                        {/* Dots */}
                        <circle cx="40" cy="60" r="4" fill="currentColor" />
                        <circle cx="100" cy="40" r="4" fill="currentColor" />
                        <circle cx="160" cy="70" r="4" fill="currentColor" />
                    </svg>
                    <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-[#6B6B6B] border border-[#E8E5DF]">
                        MAP PREVIEW
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="px-6 space-y-6 mb-8">
                {itinerary.stops.map((stop, index) => (
                    <div key={index} className="flex gap-4 relative">
                        {/* Vertical Line Connector */}
                        {index !== itinerary.stops.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-[2px] border-l-2 border-dashed border-[#E8E5DF]" />
                        )}

                        {/* Circle Checkbox */}
                        <div className="z-10 w-6 h-6 rounded-full border-2 border-[#E8E5DF] bg-white flex-shrink-0" />

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F0EDE8] text-[#3D3D3D] rounded-full">
                                    {stop.time}
                                </span>
                                <span className="text-[10px] uppercase tracking-tight text-[#9E9E9E] font-medium">
                                    {stop.category}
                                </span>
                            </div>

                            <p className="text-[15px] font-bold text-[#1A1A1A]">
                                {stop.name}
                            </p>

                            <div className="flex items-center gap-2 text-[13px] text-[#6B6B6B]">
                                <span className="flex items-center gap-1">
                                    <Wallet size={12} /> ₱{stop.cost_per_head}
                                </span>
                                <span className="text-[#E8E5DF]">·</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} /> {stop.duration_hrs}h
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-1">
                                {stop.tags.map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-[#FDF0EA] text-[#E85D26] rounded-full border border-[#FDF0EA]">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {stop.transport_to_next && stop.transport_to_next !== 'End of trip' && (
                                <p className="text-[11px] italic text-[#9E9E9E] mt-2 flex items-center gap-1">
                                    <MapPin size={10} /> {stop.transport_to_next}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Aya Note */}
            <div className="px-6 pb-8">
                <div className="p-4 bg-[#FDF0EA] rounded-xl border border-[#FDF0EA]">
                    <p className="text-[13px] italic text-[#6B6B6B] leading-relaxed">
                        "{itinerary.aya_note}"
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3">
                {!isAccepted ? (
                    <>
                        <button
                            onClick={onSkip}
                            className="flex-1 py-3 px-4 rounded-xl border border-[#E8E5DF] text-[#6B6B6B] font-semibold text-[14px] hover:bg-[#F5F3EF] transition-colors"
                        >
                            Skip
                        </button>
                        <button
                            onClick={onAccept}
                            className="flex-[2] py-3 px-4 rounded-xl bg-[#E85D26] text-white font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#D14D1A] transition-colors"
                        >
                            Use this plan <ArrowRight size={16} />
                        </button>
                    </>
                ) : (
                    <button
                        className="w-full py-4 px-4 rounded-xl bg-[#1A1A1A] text-white font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-black transition-colors"
                    >
                        Buksan sa Maps <MapPin size={18} />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
