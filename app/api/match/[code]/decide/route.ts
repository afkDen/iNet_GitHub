import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { computeMatches, ayaDecides } from '@/lib/swipe/scorer';
import { establishments } from '@/lib/data/establishments';

export async function GET(
    req: Request,
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

        // 2. Fetch all participants for session
        const { data: participants, error: participantsError } = await supabase
            .from('participants')
            .select('*')
            .eq('session_id', session.id);

        if (participantsError) throw participantsError;

        // 3. Fetch all swipes for session
        const { data: swipes, error: swipesError } = await supabase
            .from('swipes')
            .select('*')
            .eq('session_id', session.id);

        if (swipesError) throw swipesError;

        // 4. Get establishments in card_stack (with fallback)
        const stackIds = (session as any).card_stack || [];
        let sessionEstablishments = establishments.filter(e => stackIds.includes(e.id));

        // Fallback: if card_stack is empty, use all establishments
        if (sessionEstablishments.length === 0) {
            sessionEstablishments = establishments;
        }

        // 5. Compute matches
        const matches = computeMatches(swipes || [], participants || [], sessionEstablishments);

        // 6. Determine if unanimous
        const topMatch = matches[0] || null;
        const isUnanimous = topMatch
            ? topMatch.right_swipe_count === (participants?.length || 0)
            : false;

        // 7. Aya decides
        const decision = ayaDecides(matches);

        const message = isUnanimous
            ? "Pinili ng grupo si Aya. You all decided together — Aya just counted."
            : "Based on collective swipe behavior across all participants.";

        return NextResponse.json({
            decision,
            message
        });
    } catch (error: any) {
        console.error('[DECIDE_API_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
