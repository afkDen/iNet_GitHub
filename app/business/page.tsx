"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const VIBE_TAGS = [
    'budget-friendly', 'hidden gem', 'community pick', 'barkada vibes',
    'instagrammable', 'date spot', 'chill', 'open late'
];

export default function BusinessListingPage() {
    const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [dealEnabled, setDealEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPreviews = [...imagePreviews];
                newPreviews[index] = reader.result as string;
                setImagePreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : prev.length < 5 ? [...prev, tag] : prev
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setLoading(false);
        setSuccess(true);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-aya-bg text-aya-text p-6 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-aya-primary rounded-full flex items-center justify-center mb-6"
                >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>
                <h1 className="text-3xl font-bold mb-4">Listing Submitted!</h1>
                <p className="text-lg mb-2">We'll review your listing within 24 hours.</p>
                <p className="text-aya-muted mb-8 max-w-xs">Once verified, Aya will surface your spot to users whose context matches your profile.</p>
                <button
                    onClick={() => window.location.href = '/onboarding'}
                    className="px-8 py-4 bg-aya-secondary text-aya-text rounded-2xl font-bold"
                >
                    Back to Discover
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-aya-bg text-aya-text p-6 pb-24">
            <header className="mb-8 mt-4">
                <h1 className="text-4xl font-black mb-2">List your place on Aya</h1>
                <p className="text-aya-muted text-lg">Free. No tech skills needed. Takes under 5 minutes.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Name */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-aya-muted">Business Name</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. The Coffee Nook"
                        className="w-full p-4 bg-aya-secondary rounded-2xl border-none focus:ring-2 focus:ring-aya-primary outline-none"
                    />
                </div>

                {/* Photos */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-aya-muted">Photos</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                onClick={() => fileInputsRef.current[i]?.click()}
                                className={`aspect-square rounded-2xl border-2 border-dashed transition-colors cursor-pointer flex items-center justify-center overflow-hidden ${imagePreviews[i] ? 'border-aya-primary' : 'border-aya-muted'}`}
                            >
                                <input
                                    type="file"
                                    ref={el => { fileInputsRef.current[i] = el }}
                                    onChange={(e) => handleFileChange(i, e)}
                                    className="hidden"
                                    accept="image/*"
                                />
                                {imagePreviews[i] ? (
                                    <img src={imagePreviews[i]!} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-6 h-6 text-aya-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Operating Hours */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-aya-muted">Operating Hours</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-aya-muted ml-1">OPEN</span>
                            <input required type="time" className="w-full p-4 bg-aya-secondary rounded-2xl border-none focus:ring-2 focus:ring-aya-primary outline-none" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-aya-muted ml-1">CLOSE</span>
                            <input required type="time" className="w-full p-4 bg-aya-secondary rounded-2xl border-none focus:ring-2 focus:ring-aya-primary outline-none" />
                        </div>
                    </div>
                </div>

                {/* Budget Range */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-aya-muted">Budget Range</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['₱ Tipid', '₱₱ Mid', '₱₱₱ High'].map((tier, idx) => (
                            <label key={tier} className="cursor-pointer">
                                <input type="radio" name="budget" value={tier} className="peer sr-only" defaultChecked={idx === 1} />
                                <div className="p-4 text-center rounded-2xl border-2 border-aya-muted peer-checked:border-aya-primary peer-checked:bg-aya-primary/10 transition-all font-bold text-sm">
                                    {tier}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Vibe Tags */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-aya-muted">Vibe Tags</label>
                    <div className="grid grid-cols-2 gap-2">
                        {VIBE_TAGS.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`py-2 px-3 rounded-full text-sm font-medium transition-all border ${selectedTags.includes(tag)
                                        ? 'bg-aya-primary text-white border-aya-primary'
                                        : 'bg-transparent text-aya-text border-aya-muted'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Deal Toggle */}
                <div className="space-y-4 p-4 bg-aya-secondary rounded-3xl border border-aya-muted/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold">Offer a Deal?</h3>
                            <p className="text-xs text-aya-muted">Attract more users with a limited offer</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDealEnabled(!dealEnabled)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${dealEnabled ? 'bg-aya-primary' : 'bg-slate-400'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${dealEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {dealEnabled && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4 pt-2"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-aya-muted">Deal Description</label>
                                <textarea
                                    placeholder="e.g. 20% off for students until 5PM"
                                    className="w-full p-4 bg-aya-bg rounded-2xl border-none focus:ring-2 focus:ring-aya-primary outline-none h-20 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-aya-muted ml-1">START TIME</span>
                                    <input type="time" className="w-full p-3 bg-aya-bg rounded-xl border-none focus:ring-2 focus:ring-aya-primary outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-aya-muted ml-1">END TIME</span>
                                    <input type="time" className="w-full p-3 bg-aya-bg rounded-xl border-none focus:ring-2 focus:ring-aya-primary outline-none" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 bg-aya-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>Submit for review <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
                    )}
                </button>
            </form>
        </div>
    );
}
