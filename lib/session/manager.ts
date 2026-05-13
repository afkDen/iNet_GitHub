import { Establishment, SessionContext } from '@/types';
import { establishments } from '@/lib/data/establishments';

/**
 * Generates a session code in the format "AYA-XXXX"
 * where XXXX is 4 random uppercase letters/digits.
 */
export function generateSessionCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    // Simple offensive word filter for 4-letter combos (minimal for demo)
    const offensive = ['FUCK', 'SHIT', 'DICK', 'PISS'];

    do {
        code = '';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    } while (offensive.includes(code));

    return `AYA-${code}`;
}

/**
 * Builds a card stack of 18 establishments based on the session context.
 */
export function buildCardStack(context: SessionContext, allEstablishments: Establishment[]): Establishment[] {
    let filtered = [...allEstablishments];

    // 1. Filter by budget
    if (context.budget === 'tipid') {
        filtered = filtered.filter(e => e.cost_max <= 150);
    } else if (context.budget === 'mid') {
        filtered = filtered.filter(e => e.cost_max <= 400);
    }
    // 'bahala_na' has no budget filter

    // 2. Filter by distance (Simulated)
    // We assign a random distance between 0.3 and 8km and filter by context.distance_km
    filtered = filtered.map(e => ({
        ...e,
        // We use a pseudo-random distance based on ID to keep it consistent for the session if needed, 
        // but the prompt asks for random simulated distance.
        // To make it truly random per call:
        // distance_km: Math.random() * (8 - 0.3) + 0.3
    }));

    // Since we can't actually add a property to the Establishment type without modifying it,
    // we'll just filter based on a random check.
    filtered = filtered.filter(() => {
        const simulatedDistance = Math.random() * (8 - 0.3) + 0.3;
        return simulatedDistance <= context.distance_km;
    });

    // 3. Filter by outing_type
    if (context.outing_type === 'food') {
        filtered = filtered.filter(e => e.category !== 'activity');
    } else if (context.outing_type === 'activities') {
        // Prioritize activities: move them to the front
        filtered.sort((a, b) => (a.category === 'activity' ? -1 : b.category === 'activity' ? 1 : 0));
    } else if (context.outing_type === 'explore') {
        // Mix all (no specific filter, just shuffle later)
    } else if (context.outing_type === 'full_day') {
        // All categories
    }

    // Shuffle the filtered results
    const shuffled = filtered.sort(() => Math.random() - 0.5);

    // Ensure at least 2 community pins if available
    const communityPins = shuffled.filter(e => e.is_community_pin);
    const nonCommunity = shuffled.filter(e => !e.is_community_pin);

    let finalStack: Establishment[] = [];

    // Add up to 2 community pins first
    const pinsToAdd = communityPins.slice(0, 2);
    finalStack.push(...pinsToAdd);

    // Fill the rest from the shuffled list, avoiding duplicates
    const pinIds = new Set(pinsToAdd.map(p => p.id));
    const remaining = shuffled.filter(e => !pinIds.has(e.id));

    // Ensure at least 1 deal if available
    const deals = remaining.filter(e => e.is_deal);
    if (deals.length > 0) {
        const dealToAdd = deals[0];
        finalStack.push(dealToAdd);
        const finalPinAndDealIds = new Set([...finalStack.map(p => p.id)]);
        const others = remaining.filter(e => !finalPinAndDealIds.has(e.id));
        finalStack.push(...others.slice(0, 18 - finalStack.length));
    } else {
        finalStack.push(...remaining.slice(0, 18 - finalStack.length));
    }

    return finalStack.slice(0, 18);
}
