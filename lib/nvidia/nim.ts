import OpenAI from 'openai';
import { Establishment, SessionContext } from '@/types';

export const nimClient = new OpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY,
});

export const NIM_MODEL = process.env.NVIDIA_NIM_MODEL || 'google/gemma-4-31b-it';

const VIBE_TAG_PROMPT = `
You are a vibe tag generator for a local Filipino discovery app called Aya.
Given a venue name, category, district, and cost tier, generate exactly 3-4 concise vibe tags.

Choose ONLY from this list:
budget-friendly, hidden gem, open late, family-friendly, instagrammable, chill,
may parking, kid-friendly, date spot, barkada favorite, good for solo, quick service,
community pick, outdoor seating, pet-friendly, live music, late night, near commute

Return ONLY a JSON array of strings. No explanation. No markdown. Example:
["budget-friendly", "hidden gem", "chill"]
`;

const CONTEXT_PARSE_PROMPT = `
You are a context parser for Aya, a Filipino dining and outing recommendation app.
Extract structured filters from natural language input in Filipino, Taglish, or English.

Return ONLY valid JSON with no explanation, no markdown, no backticks:
{
  "outing_type": "food" | "activities" | "explore" | "full_day",
  "group_size": number,
  "budget": "tipid" | "mid" | "bahala_na",
  "distance_km": number,
  "time_of_day": "lunch" | "merienda" | "dinner" | "anytime",
  "vibe_keywords": []
}

Filipino budget hints: "tipid/mura/wala masyadong budget" -> "tipid", "kaya naman/ok lang" -> "mid", "ok kahit mahal/bahala na" -> "bahala_na"
Group size hints: "kami dalawa/tatlo" -> 2 or 3, "grupo/barkada" -> 5, "pamilya" -> 4, "solo/ako lang" -> 1
`;

// Simple response cache to avoid redundant NIM calls
const vibeCache = new Map<string, string[]>();

export async function generateVibeTags(establishment: Partial<Establishment>, context?: SessionContext): Promise<string[]> {
    if (!establishment.id) return establishment.vibe_tags || [];

    if (vibeCache.has(establishment.id)) {
        return vibeCache.get(establishment.id)!;
    }

    try {
        const prompt = `${VIBE_TAG_PROMPT}\n\nVenue: ${establishment.name}\nCategory: ${establishment.category}\nDistrict: ${establishment.city}\nCost Tier: ${establishment.cost_min}-${establishment.cost_max}`;

        const response = await nimClient.chat.completions.create({
            model: NIM_MODEL,
            messages: [
                { role: 'system', content: VIBE_TAG_PROMPT },
                { role: 'user', content: prompt },
            ],
            max_tokens: 300,
            temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('Empty response from NIM');

        const tags = JSON.parse(content) as string[];
        if (Array.isArray(tags)) {
            vibeCache.set(establishment.id, tags);
            return tags;
        }
        throw new Error('Invalid JSON format');
    } catch (error) {
        console.error('[NIM generateVibeTags Error]:', error);
        return establishment.vibe_tags || [];
    }
}

export async function parseNaturalLanguageContext(input: string, base: SessionContext): Promise<Partial<SessionContext>> {
    try {
        const response = await nimClient.chat.completions.create({
            model: NIM_MODEL,
            messages: [
                { role: 'system', content: CONTEXT_PARSE_PROMPT },
                { role: 'user', content: input },
            ],
            max_tokens: 500,
            temperature: 0.3,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) return {};

        const updates = JSON.parse(content) as Partial<SessionContext>;
        return updates;
    } catch (error) {
        console.error('[NIM parseNaturalLanguageContext Error]:', error);
        return {};
    }
}
