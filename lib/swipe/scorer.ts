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
    swipes: SwipeRecord[],
    participants: Participant[],
    establishments: Establishment[]
): MatchResult[] {
    const rightSwipes = swipes.filter(s => s.direction === 'right');
    const establishmentMap = new Map(establishments.map(e => [e.id, e]));

    // Group right swipes by establishment_id
    const groups = new Map<string, SwipeRecord[]>();
    for (const swipe of rightSwipes) {
        if (!groups.has(swipe.establishment_id)) {
            groups.set(swipe.establishment_id, []);
        }
        groups.get(swipe.establishment_id)!.push(swipe);
    }

    const results: MatchResult[] = [];

    for (const [estId, estSwipes] of groups.entries()) {
        const establishment = establishmentMap.get(estId);
        if (!establishment) continue;

        const rightSwipeCount = estSwipes.length;
        const enthusiasmScore = estSwipes.reduce((sum, s) =>
            sum + scoreSwipe(s.speed_ms, s.drag_distance), 0
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
