import { Establishment, Participant, SwipeRecord, MatchResult } from '@/types';

/**
 * Calculates an enthusiasm score for a single swipe based on speed and drag distance.
 * Fast swipes and long drags indicate higher enthusiasm.
 */
export function scoreSwipe(speedMs: number, dragDistance: number): number {
    const speedBonus = Math.max(0, (5000 - speedMs) / 50);
    const dragBonus = Math.min(50, dragDistance / 3);
    return speedBonus + dragBonus;
}

/**
 * Computes matches by grouping right swipes and ranking them by count and enthusiasm.
 */
export function computeMatches(
    swipes: any[],
    participants: Participant[],
    establishments: Establishment[]
): MatchResult[] {
    const rightSwipes = swipes.filter(s => s.direction === 'right');
    const establishmentMap = new Map(establishments.map(e => [e.id, e]));

    // Group right swipes by venue_id (DB column name) or establishment_id (type field)
    const groups = new Map<string, any[]>();
    for (const swipe of rightSwipes) {
        // The DB column is venue_id, but the type uses establishment_id.
        // Support both so this works regardless of which field is populated.
        const venueId = swipe.venue_id || swipe.establishment_id;
        if (!venueId) {
            console.warn('[computeMatches] Swipe record missing venue_id/establishment_id:', swipe);
            continue;
        }
        if (!groups.has(venueId)) {
            groups.set(venueId, []);
        }
        groups.get(venueId)!.push(swipe);
    }

    const results: MatchResult[] = [];

    for (const [estId, estSwipes] of groups.entries()) {
        const establishment = establishmentMap.get(estId);
        if (!establishment) continue;

        const rightSwipeCount = estSwipes.length;
        const enthusiasmScore = estSwipes.reduce((sum, s) =>
            sum + scoreSwipe(s.swipe_speed_ms ?? s.speed_ms ?? 0, s.drag_distance ?? 0), 0
        );

        results.push({
            establishment,
            right_swipe_count: rightSwipeCount,
            enthusiasm_score: enthusiasmScore,
            participant_swipes: estSwipes
        });
    }

    // Sort by right_swipe_count DESC, then enthusiasm_score DESC
    return results.sort((a, b) => {
        if (b.right_swipe_count !== a.right_swipe_count) {
            return b.right_swipe_count - a.right_swipe_count;
        }
        return b.enthusiasm_score - a.enthusiasm_score;
    });
}

/**
 * Aya's final decision: picks the highest scored match.
 */
export function ayaDecides(matches: MatchResult[]): MatchResult | null {
    return matches.length > 0 ? matches[0] : null;
}
