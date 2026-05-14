"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const VIBE_TAGS = [
    'budget-friendly', 'hidden gem', 'community pick', 'barkada vibes',
    'instagrammable', 'date spot', 'chill', 'open late'
];

export default function DropAPinPage() {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
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

    const resetForm = () => {
        setImagePreview(null);
        setSelectedTags([]);
        setText('');
        setSuccess(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-aya-bg text-aya-text p-6 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6"
                >
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>
                <h1 className="text-3xl font-bold mb-2">Salamat!</h1>
                <p className="text-lg mb-2">Your pin is in the verification queue.</p>
                <p className="text-aya-muted mb-8">Nearby locals will confirm your spot within 48 hours.</p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button
                        onClick={resetForm}
                        className="w-full py-4 bg-aya-primary text-white rounded-2xl font-bold"
                    >
                        Pin another spot
                    </button>
                    <button
                        onClick={() => router.push('/onboarding')}
                        className="w-full py-4 bg-aya-secondary text-aya-text rounded-2xl font-bold"
                    >
                        Back to Discover
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-aya-bg text-aya-text p-6 pb-24">
            <header className="mb-8 mt-4">
                <h1 className="text-4xl font-black mb-2">Drop a Pin</h1>
                <p className="text-aya-muted text-lg">Add a spot that doesn't show up anywhere else.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative h-48 rounded-3xl border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center overflow-hidden ${imagePreview ? 'border-aya-primary' : 'border-aya-muted'}`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center p-4">
                            <svg className="w-10 h-10 mx-auto mb-2 text-aya-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-aya-muted font-medium">Tap to upload photo</p>
                        </div>
                    )}
                </div>

                {/* Place Name */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-aya-muted">Place Name</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. Aling Nena's Secret Garden"
                        className="w-full p-4 bg-aya-secondary rounded-2xl border-none focus:ring-2 focus:ring-aya-primary outline-none"
                    />
                </div>

                {/* Fake Map */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-aya-muted">Location</label>
                    <div className="relative h-48 bg-slate-200 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-300">
                        {/* Fake Map Background */}
                        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <svg className="w-10 h-10 text-red-500 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                <circle cx="12" cy="9" r="2.5" fill="white" />
                            </svg>
                            <p className="text-xs font-bold text-slate-500 mt-2 bg-white/80 px-2 py-1 rounded-full">Tap to place pin on map</p>
                        </div>
                    </div>
                </div>

                {/* Why should people know this? */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-bold uppercase tracking-wider text-aya-muted">Why should people know this?</label>
                        <span className={`text-xs font-mono ${text.length > 100 ? 'text-red-500' : 'text-aya-muted'}`}>{text.length}/100</span>
                    </div>
                    <textarea
                        maxLength={100}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Best sisig in the neighborhood..."
                        className="w-full p-4 bg-aya-secondary rounded-2xl border-none focus:ring-2 focus:ring-aya-primary outline-none h-24 resize-none"
                    />
                </div>

                {/* Vibe Tags */}
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-aya-muted">Vibes</label>
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

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 bg-aya-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>Submit for verification <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
                    )}
                </button>
            </form>
        </div>
    );
}
