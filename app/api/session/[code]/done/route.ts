import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const body = await req.json();
        const participantId = body.participant_id;

        if (!participantId) {
            return NextResponse.json({ error: 'Missing participant_id' }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. Fetch session by code
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('id')
            .eq('code', code)
            .single();

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // 2. Mark participant as done
        const { error: updateError } = await supabase
            .from('participants')
            .update({ is_done: true, status: 'done' })
            .eq('id', participantId)
            .eq('session_id', session.id);

        if (updateError) {
            console.error('[Done Route] Failed to mark participant done:', updateError);
            return NextResponse.json({ error: 'Failed to update participant' }, { status: 500 });
        }

        // 3. Check if ALL participants are done
        const { data: allParticipants, error: countError } = await supabase
            .from('participants')
            .select('id, is_done')
            .eq('session_id', session.id);

        if (countError) {
            console.error('[Done Route] Failed to check participants:', countError);
            return NextResponse.json({ success: true, all_done: false });
        }

        const allDone = allParticipants.length > 0 && allParticipants.every(p => p.is_done);

        // 4. If all done, update session status to 'completed'
        if (allDone) {
            const { error: sessionUpdateError } = await supabase
                .from('sessions')
                .update({ status: 'completed' })
                .eq('id', session.id);

            if (sessionUpdateError) {
                console.error('[Done Route] Failed to update session status:', sessionUpdateError);
            } else {
                console.log(`[Done Route] Session ${code} marked as completed — all ${allParticipants.length} participants done`);
            }
        }

        return NextResponse.json({
            success: true,
            all_done: allDone,
            participant_count: allParticipants.length,
        });

    } catch (error) {
        console.error('[Done Route Error]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
