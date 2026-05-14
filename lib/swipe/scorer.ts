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
 * Formula (DESIGN.md §4.5): 
 * Consensus (50%) + Speed (30%) + Hesitation (20%)
 */
export function computeMatches(
    swipes: SwipeRecord[],
    participants: Participant[],
    establishments: Establishment[]
): MatchResult[] {
    const rightSwipes = swipes.filter(s => s.direction === 'right');
    const establishmentMap = new Map(establishments.map(e => [e.id, e]));
    const totalParticipants = Math.max(1, participants.length);

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
        
        // Consensus component (50%)
        const consensusScore = (rightSwipeCount / totalParticipants) * 0.5;

        // Speed component (30%) - Fast swipe (>300px/s) = 0.3, slow = 0.1
        const avgSpeed = estSwipes.reduce((sum, s) => sum + (s.speed_ms || 0), 0) / rightSwipeCount;
        const speedScore = avgSpeed > 300 ? 0.3 : 0.1;

        // Hesitation component (20%) - Less hesitation (under 3s) is higher score
        const avgHesitation = estSwipes.reduce((sum, s) => sum + (s.hesitation_ms || 0), 0) / rightSwipeCount;
        const hesitationScore = Math.max(0, (1 - avgHesitation / 3000)) * 0.2;

        const totalEnthusiasmScore = consensusScore + speedScore + hesitationScore;

        results.push({
            establishment,
            right_swipe_count: rightSwipeCount,
            enthusiasm_score: totalEnthusiasmScore,
            participant_swipes: estSwipes
        });
    }

    // Sort by enthusiasm_score DESC
    return results.sort((a, b) => b.enthusiasm_score - a.enthusiasm_score);
}

/**
 * Aya's final decision: picks the highest scored match.
 */
export function ayaDecides(matches: MatchResult[]): MatchResult | null {
    return matches.length > 0 ? matches[0] : null;
}
