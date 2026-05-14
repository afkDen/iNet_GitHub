export interface HistoryEntry {
    date: string;
    mode: 'GROUP' | 'SOLO' | 'ITINERARY';
    modeDetail?: string;
    venue: string;
    distance?: string;
    desc?: string;
    prompt?: string;
    isRecent?: boolean;
}

export interface WantToTryEntry {
    id: string;
    name: string;
    category: string;
    distance: string;
    city: string;
    tags: string[];
}

export const SAMPLE_HISTORY: HistoryEntry[] = [
    {
        date: 'Today, 9:30 AM',
        mode: 'GROUP',
        modeDetail: '4 PEOPLE',
        venue: "Lito's Brew & Bites",
        distance: '1.2 km from Makati',
        prompt: 'DID YOU GO?',
        isRecent: true,
    },
    {
        date: 'May 8',
        mode: 'ITINERARY',
        venue: 'Sunday Plan — Cubao',
        desc: '3 stops · ₱780/head · 5.5 hrs',
    },
    {
        date: 'May 6',
        mode: 'SOLO',
        venue: "Ate Nena's Kitchen",
        desc: 'Visited · Community pick · QC',
    },
    {
        date: 'Apr 30',
        mode: 'GROUP',
        modeDetail: '6 PEOPLE',
        venue: 'Bayleaf Rooftop',
        desc: 'Matched · Community pin · Intramuros',
    },
];

export const WANT_TO_TRY: WantToTryEntry[] = [
    {
        id: 'wtt-1',
        name: 'Hidden Garden Bistro',
        category: 'Restaurant',
        distance: '3.8 km',
        city: 'Marikina',
        tags: ['date spot', 'instagrammable', 'hidden gem'],
    },
    {
        id: 'wtt-2',
        name: 'Intramuros Bamboo Bike Tour',
        category: 'Activity',
        distance: '5.2 km',
        city: 'Manila',
        tags: ['barkada vibes', 'hidden gem', 'artsy'],
    },
    {
        id: 'wtt-3',
        name: 'The Sky Lounge',
        category: 'Bar',
        distance: '2.1 km',
        city: 'Makati',
        tags: ['rooftop', 'date spot', 'open late'],
    },
];
