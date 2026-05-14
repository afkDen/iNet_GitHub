import { SessionContext, Itinerary } from '@/types';
import { itineraries } from '@/lib/data/itineraries';

/**
 * Smart-ish preset lookup for Lakbay itineraries based on user context.
 */
export function selectItinerary(context: SessionContext): Itinerary {
    // 1. Filter by budget first
    const budgetMatches = itineraries.filter(i => {
        if (context.budget === 'tipid') return i.budget_tier === 'tipid';
        if (context.budget === 'mid') return i.budget_tier === 'mid';
        return i.budget_tier === 'bahala_na';
    });

    if (budgetMatches.length === 0) return itineraries[0];

    // 2. Try to match by outing type (simulated keywords)
    if (context.outing_type === 'food') {
        const foodItin = budgetMatches.find(i => i.aya_note.toLowerCase().includes('dining') || i.aya_note.toLowerCase().includes('food'));
        if (foodItin) return foodItin;
    }

    if (context.outing_type === 'activities') {
        const activityItin = budgetMatches.find(i => i.stops.some(s => s.category === 'activity'));
        if (activityItin) return activityItin;
    }

    // Default to the first one in the budget tier
    return budgetMatches[0];
}
