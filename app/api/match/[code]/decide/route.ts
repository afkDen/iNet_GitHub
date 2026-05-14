export async function GET(
    req: Request,
    { params }: { params: Promise<{ code: string }> }
) {

    try {
        const { code } = await params;
        const supabase = await (await import('@/lib/supabase/server')).createClient();
        const { computeMatches, ayaDecides } = await import('@/lib/swipe/scorer');
        const { establishments } = await import('@/lib/data/establishments');

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

        // 4. Get establishments in card_stack
        const stackIds = session.card_stack as string[];
        const sessionEstablishments = establishments.filter(e => stackIds.includes(e.id));

        // 5. Compute matches
        const matches = computeMatches(swipes || [], participants || [], sessionEstablishments);

        // 6. Determine if unanimous
        const topMatch = matches[0] || null;
        const isUnanimous = topMatch
            ? topMatch.right_swipe_count === (participants?.length || 0)
            : false;

        // 7. Aya decides
        const decision = ayaDecides(matches);

        let message = "";
        if (session.mode === 'solo') {
            message = "Aya picked this because you swiped fast and didn't hesitate!";
        } else {
            message = isUnanimous
                ? "Everyone agreed! It's a unanimous group pick."
                : "Aya picked this based on group consensus and collective enthusiasm.";
        }

        return NextResponse.json({
            decision,
            message
        });
    } catch (error: any) {
        console.error('[DECIDE_API_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
