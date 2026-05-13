import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    req: NextRequest,
    { params }: { params: { code: string } }
) {
    try {
        const { code } = params;
        const body = await req.json();
        const nickname = body.nickname || 'Anonymous';

        const supabase = await createClient();

        // 1. Fetch session by code, 404 if not found
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('id')
            .eq('code', code)
            .single();

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // 2. Insert participant
        const { data: participant, error: participantError } = await supabase
            .from('participants')
            .insert({
                session_id: session.id,
                display_name: nickname,
                status: 'joined'
            })
            .select()
            .single();

        if (participantError) {
            console.error('[Join Session Error]', participantError);
            return NextResponse.json({ error: 'Database error adding participant' }, { status: 500 });
        }

        return NextResponse.json({ participant });

    } catch (error) {
        console.error('[Join Session API Error]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
