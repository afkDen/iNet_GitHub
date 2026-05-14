"use client";

import React, { useState, useEffect } from 'react';
import { SAMPLE_HISTORY, WANT_TO_TRY, HistoryEntry } from '@/lib/data/history';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoryPage() {
    const [activeTab, setActiveTab] = useState<'history' | 'want'>('history');
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [showUpload, setShowUpload] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('aya_history');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setHistory([...parsed, ...SAMPLE_HISTORY]);
            } catch (e) {
                setHistory(SAMPLE_HISTORY);
            }
        } else {
            setHistory(SAMPLE_HISTORY);
        }
    }, []);

    const handleDidGo = async (venueId: string) => {
        setShowUpload(venueId);
        // Fake upload process
        setTimeout(() => {
            setUploading(true);
            setTimeout(() => {
                setUploading(false);
                setUploadSuccess(true);
                setTimeout(() => {
                    setUploadSuccess(false);
                    setShowUpload(null);
                }, 2000);
            }, 1500);
        }, 500);
    };

    const handleShareRecap = async () => {
        const text = `Just finished an Aya session! We matched at ${history[0]?.venue || 'a great spot'}. Check out Aya to find your next hangout!`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Aya Recap', text });
            } catch (e) {
                console.log('Share cancelled');
            }
        } else {
            alert('Recap copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-aya-bg text-aya-text p-6 pb-24">
            <header className="mb-8 mt-4 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black mb-2">Your Outings</h1>
                    <p className="text-aya-muted text-lg">Memories and wishlists</p>
                </div>
                <button
                    onClick={handleShareRecap}
                    className="p-3 bg-aya-secondary rounded-2xl text-aya-text font-bold text-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.297a1.155 1.155 0 001.76-1.157l-1.997-2.68a3 3 0 00-3.003-.178m-6.632 3.297l1.997-2.68a3 3 0 013.003-.178m-6.632 3.297l1.997-2.68a3 3 0 013.003-.178" />
                    </svg>
                    Share Recap
                </button>
            </header>

            {/* Tabs */}
            <div className="flex p-1 bg-aya-secondary rounded-2xl mb-8">
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-aya-bg text-aya-text shadow-sm' : 'text-aya-muted'}`}
                >
                    History
                </button>
                <button
                    onClick={() => setActiveTab('want')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'want' ? 'bg-aya-bg text-aya-text shadow-sm' : 'text-aya-muted'}`}
                >
                    Want to Try
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'history' ? (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                    >
                        {history.map((entry, i) => (
                            <div key={i} className="p-4 bg-aya-secondary rounded-3xl border border-aya-muted/20 flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full bg-aya-primary" />
                                    {i !== history.length - 1 && <div className="w-0.5 h-full bg-aya-muted/30 my-1" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-aya-muted">{entry.date}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${entry.mode === 'GROUP' ? 'bg-blue-100 text-blue-600' :
                                                entry.mode === 'ITINERARY' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            {entry.mode}{entry.modeDetail ? ` · ${entry.modeDetail}` : ''}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg">{entry.venue}</h3>
                                    <p className="text-aya-muted text-sm">{entry.distance || entry.desc}</p>

                                    {entry.prompt && (
                                        <button
                                            onClick={() => handleDidGo(entry.venue)}
                                            className="mt-3 px-4 py-2 bg-aya-bg border border-aya-muted rounded-xl text-xs font-bold hover:bg-white transition-colors"
                                        >
                                            {entry.prompt}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="want"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 gap-4"
                    >
                        {WANT_TO_TRY.map((spot) => (
                            <div key={spot.id} className="p-4 bg-aya-secondary rounded-3xl border border-aya-muted/20 flex items-center gap-4">
                                <div className="w-16 h-16 bg-aya-bg rounded-2xl flex items-center justify-center text-2xl">
                                    {spot.category === 'Restaurant' ? '🍲' : spot.category === 'Activity' ? '🚲' : '🍸'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold">{spot.name}</h3>
                                        <span className="text-xs text-aya-muted">{spot.distance}</span>
                                    </div>
                                    <p className="text-xs text-aya-muted">{spot.city} · {spot.category}</p>
                                    <div className="flex gap-1 mt-2">
                                        {spot.tags.map(tag => (
                                            <span key={tag} className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-aya-bg rounded-md text-aya-muted">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fake Upload Modal */}
            <AnimatePresence>
                {showUpload && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-aya-bg w-full max-w-sm rounded-3xl p-6 text-center"
                        >
                            <h3 className="text-2xl font-bold mb-2">Proof of Visit!</h3>
                            <p className="text-aya-muted mb-6">Upload a photo from your trip to {showUpload}</p>

                            <div
                                onClick={() => { }}
                                className="aspect-square w-full max-w-[240px] mx-auto rounded-3xl border-2 border-dashed border-aya-muted flex flex-col items-center justify-center cursor-pointer mb-6"
                            >
                                {uploading ? (
                                    <div className="w-8 h-8 border-2 border-aya-primary border-t-transparent rounded-full animate-spin" />
                                ) : uploadSuccess ? (
                                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <>
                                        <svg className="w-10 h-10 text-aya-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm font-bold text-aya-muted">Tap to upload</p>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => setShowUpload(null)}
                                className="w-full py-4 bg-aya-secondary rounded-2xl font-bold"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
