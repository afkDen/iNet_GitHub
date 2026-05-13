import { useState, useEffect } from 'react';
import { Establishment, SessionContext } from '@/types';

export function useVibeAI(establishment: Establishment | null, context: SessionContext | null) {
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!establishment) {
            setTags([]);
            return;
        }

        // If establishment already has 3+ vibe tags, use them directly (no API call)
        if (establishment.vibe_tags && establishment.vibe_tags.length >= 3) {
            setTags(establishment.vibe_tags);
            setLoading(false);
            return;
        }

        const fetchVibeTags = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/ai/vibe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ establishment, context }),
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }

                const data = await response.json();
                setTags(data.tags || establishment.vibe_tags || []);
            } catch (err) {
                console.error('useVibeAI error:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch vibe tags');
                setTags(establishment.vibe_tags || []);
            } finally {
                setLoading(false);
            }
        };

        fetchVibeTags();
    }, [establishment, context]);

    return { tags, loading, error };
}
