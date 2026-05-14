import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { establishments } from '@/lib/data/establishments';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const supabase = await createClient();

        // 1. Fetch session by code
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('*')
            .eq('code', code)
            .single();

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // 2. Fetch establishments matching card_stack IDs in order
        // The card_stack is stored as an array of IDs in the sessions table
        const cardStackIds = (session as any).card_stack || [];

        let cardStack: typeof establishments = [];

        if (cardStackIds.length > 0) {
            // Filter the seeded establishments list to match the IDs and maintain order
            cardStack = cardStackIds
                .map((id: string) => establishments.find(e => e.id === id))
                .filter(Boolean) as typeof establishments;
        }

        // FALLBACK: If card_stack is empty (e.g., column missing or not populated),
        // rebuild from mock data using session filters
        if (cardStack.length === 0) {
            console.warn('[Session GET] card_stack empty, rebuilding from mock data using session filters');
            const { buildCardStack } = await import('@/lib/session/manager');
            const filters = (session as any).filters || {};
            const context = {
                mode: session.mode || 'solo',
                outing_type: filters.outingType || filters.outing_type || 'food',
                group_size: filters.groupSize === 'solo' ? 1 : filters.groupSize === 'small' ? 2 : filters.groupSize === 'medium' ? 4 : 8,
                budget: filters.budget || 'mid',
                distance_km: filters.maxDistanceKm || filters.distance_km || 5,
                time_of_day: filters.timeContext || filters.time_of_day || 'anytime',
                natural_language: filters.nlpInput || filters.natural_language || undefined,
            };
            cardStack = buildCardStack(context, establishments);
        }

        return NextResponse.json({
            session,
            cardStack
        });

    } catch (error) {
        console.error('[Session GET Error]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
